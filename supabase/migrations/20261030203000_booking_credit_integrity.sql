-- A booking may be recorded without a payment. Only refund a credit that the
-- particular booking actually consumed; never guess from the student's balance.
alter table public.bookings
  add column credit_id uuid references public.booking_credits(id) on delete restrict,
  add column owner_notified_at timestamptz,
  add column owner_notification_payload jsonb;

-- A full unique index is required for PostgREST ON CONFLICT inference. PostgreSQL
-- still permits multiple NULL references. The earlier partial index is redundant.
drop index if exists public.bookings_calcom_reference_idx;
alter table public.bookings
  add constraint bookings_calcom_reference_key unique (calcom_reference);

drop trigger if exists on_booking_credit_consumed on public.bookings;
create or replace function public.consume_credit_for_booking()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_credit uuid;
begin
  if new.status = 'scheduled'
    and (tg_op = 'INSERT' or old.status <> 'scheduled')
    and new.credit_id is null then
    update public.booking_credits
      set credits_used = credits_used + 1
      where id = (
        select id from public.booking_credits
        where student_id = new.student_id and credits_used < credits_total
        order by created_at, id
        for update
        limit 1
      ) returning id into v_credit;
    if v_credit is not null then
      update public.bookings set credit_id = v_credit where id = new.id;
    end if;
  elsif tg_op = 'UPDATE' and new.status = 'cancelled'
    and old.status = 'scheduled' and old.credit_id is not null then
    update public.booking_credits
      set credits_used = greatest(credits_used - 1, 0)
      where id = old.credit_id;
    update public.bookings set credit_id = null where id = new.id;
  end if;
  return null;
end;
$$;

-- AFTER INSERT fires only for a row actually inserted, not the attempted insert
-- of ON CONFLICT DO UPDATE. Replayed creates cannot consume a second credit.
create trigger on_booking_credit_consumed
  after insert or update of status on public.bookings
  for each row execute function public.consume_credit_for_booking();

-- Cal rescheduling replaces the UID. Keep old aliases so retries of the original
-- create, later reschedules, and cancellation all resolve to one booking.
create table public.booking_calcom_references (
  reference text primary key,
  booking_id uuid not null references public.bookings(id) on delete cascade
);
alter table public.booking_calcom_references enable row level security;
revoke all on public.booking_calcom_references from public, anon, authenticated;
grant all on public.booking_calcom_references to service_role;
insert into public.booking_calcom_references(reference, booking_id)
  select calcom_reference, id from public.bookings where calcom_reference is not null;

create function public.record_calcom_booking(
  p_event text,
  p_reference text,
  p_previous_reference text,
  p_student_id uuid,
  p_starts_at timestamptz
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_booking public.bookings;
  v_ids uuid[];
  v_lock bigint;
begin
  if p_event is null or p_event not in ('BOOKING_CREATED', 'BOOKING_CANCELLED', 'BOOKING_RESCHEDULED')
    or p_reference is null or btrim(p_reference) = '' then
    raise exception 'Invalid booking event' using errcode = '22023';
  end if;
  if p_event = 'BOOKING_RESCHEDULED'
    and (p_previous_reference is null or btrim(p_previous_reference) = '') then
    raise exception 'Missing previous booking UID' using errcode = '22023';
  end if;

  -- Serialize overlapping UID deliveries, including the first create where no
  -- row exists yet. Sorted lock keys also cover concurrent reschedule chains.
  for v_lock in
    select distinct pg_catalog.hashtextextended(reference, 0)
    from unnest(array[p_reference, p_previous_reference]) as references_to_lock(reference)
    where reference is not null order by 1
  loop
    perform pg_catalog.pg_advisory_xact_lock(v_lock);
  end loop;
  select array_agg(distinct booking_id) into v_ids
    from public.booking_calcom_references
    where reference = p_reference or reference = p_previous_reference;
  if cardinality(v_ids) > 1 then
    raise exception 'Booking references conflict' using errcode = '22023';
  end if;
  if cardinality(v_ids) = 1 then
    select * into v_booking from public.bookings where id = v_ids[1] for update;
  else
    if p_student_id is null then
      raise exception 'Student account not found' using errcode = 'P0002';
    end if;
    insert into public.bookings(student_id, starts_at, calcom_reference, status)
      values (p_student_id, p_starts_at, p_reference,
        case when p_event = 'BOOKING_CANCELLED' then 'cancelled' else 'scheduled' end)
      returning * into v_booking;
  end if;

  if p_event = 'BOOKING_CANCELLED' then
    -- A cancellation for an old UID after a reschedule does not cancel the new
    -- session. Repeated cancellation does not refund again.
    update public.bookings set status = 'cancelled'
      where id = v_booking.id and status = 'scheduled' and calcom_reference = p_reference;
  elsif p_event = 'BOOKING_RESCHEDULED'
    and v_booking.calcom_reference in (p_previous_reference, p_reference) then
    -- An old reschedule replay cannot rewind a later reschedule in the chain.
    update public.bookings
      set calcom_reference = p_reference, starts_at = p_starts_at
      where id = v_booking.id;
  end if;
  insert into public.booking_calcom_references(reference, booking_id)
    values (p_reference, v_booking.id) on conflict (reference) do nothing;
  if p_previous_reference is not null then
    insert into public.booking_calcom_references(reference, booking_id)
      values (p_previous_reference, v_booking.id) on conflict (reference) do nothing;
  end if;

  -- Freeze the notification body on first observation. Resend requires identical
  -- payloads for retries using the same idempotency key, even after rescheduling.
  update public.bookings b
    set owner_notification_payload = jsonb_build_object(
      'email', (select email from public.profiles where id = b.student_id),
      'starts_at', b.starts_at)
    where b.id = v_booking.id and owner_notification_payload is null;
  select * into v_booking from public.bookings where id = v_booking.id;
  return jsonb_build_object(
    'booking_id', v_booking.id,
    'notify_owner', p_event = 'BOOKING_CREATED' and v_booking.status = 'scheduled'
      and v_booking.owner_notified_at is null,
    'notification', v_booking.owner_notification_payload);
end;
$$;
revoke all on function public.record_calcom_booking(text,text,text,uuid,timestamptz)
  from public, anon, authenticated;
grant execute on function public.record_calcom_booking(text,text,text,uuid,timestamptz)
  to service_role;

-- Historical bookings have no reliable per-booking credit association. Leave
-- credit_id NULL; reconcile any historical usage explicitly before refunding it.
notify pgrst, 'reload schema';
