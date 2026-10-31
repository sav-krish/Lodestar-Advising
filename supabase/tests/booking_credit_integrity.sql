-- Run ONLY inside an outer BEGIN ... ROLLBACK transaction, after the pending
-- booking migrations. Synthetic Auth/SQL rows only: no Cal or email API calls.
-- Do not COMMIT this fixture or disable hosted Storage metadata protections.
select set_config('request.jwt.claim.role', 'service_role', true);
insert into auth.users(id, email, email_confirmed_at, raw_user_meta_data)
values ('a440a111-0625-422b-9ccc-5cb9b2199002',
  'lodestar-booking-check@example.invalid', now(), '{}');

set local role service_role;
do $$
declare
  student uuid := 'a440a111-0625-422b-9ccc-5cb9b2199002';
  first_payment uuid;
  second_payment uuid;
  first_credit uuid;
  second_credit uuid;
  unpaid_booking uuid;
  paid_booking uuid;
  rescheduled_booking uuid;
  second_paid_booking uuid;
  result jsonb;
  frozen_notification jsonb;
begin
  result := public.record_calcom_booking('BOOKING_CREATED', 'fixture-unpaid', null,
    student, '2026-11-02T15:00:00Z');
  unpaid_booking := (result->>'booking_id')::uuid;
  if not exists (select 1 from public.bookings where id = unpaid_booking
    and status = 'scheduled' and credit_id is null) then
    raise exception 'A student without payment could not book';
  end if;
  if not (result->>'notify_owner')::boolean then
    raise exception 'New booking did not request owner notification';
  end if;

  insert into public.payment_submissions(student_id, program, amount_cents, status)
    values (student, 'hour', 5000, 'approved') returning id into first_payment;
  select id into first_credit from public.booking_credits where payment_id = first_payment;
  result := public.record_calcom_booking('BOOKING_CREATED', 'fixture-paid', null,
    student, '2026-11-03T15:00:00Z');
  paid_booking := (result->>'booking_id')::uuid;
  if (select credit_id from public.bookings where id = paid_booking) is distinct from first_credit
    or (select credits_used from public.booking_credits where id = first_credit) <> 1 then
    raise exception 'Booking did not consume and associate its available credit';
  end if;
  result := public.record_calcom_booking('BOOKING_CREATED', 'fixture-paid', null,
    student, '2026-11-03T15:00:00Z');
  if (result->>'booking_id')::uuid <> paid_booking
    or (select credits_used from public.booking_credits where id = first_credit) <> 1 then
    raise exception 'Repeated create consumed credit twice';
  end if;

  -- This unpaid booking predates the payment. Cancelling it must not refund the
  -- credit consumed by a different, still-scheduled session.
  perform public.record_calcom_booking('BOOKING_CANCELLED', 'fixture-unpaid', null,
    null, null);
  if (select credits_used from public.booking_credits where id = first_credit) <> 1 then
    raise exception 'Unpaid cancellation refunded another booking credit';
  end if;
  result := public.record_calcom_booking('BOOKING_CREATED', 'fixture-also-unpaid', null,
    student, '2026-11-04T15:00:00Z');
  if (select credit_id from public.bookings where id = (result->>'booking_id')::uuid) is not null then
    raise exception 'Exhausted credit was assigned to an unpaid booking';
  end if;
  perform public.record_calcom_booking('BOOKING_CANCELLED', 'fixture-also-unpaid', null,
    null, null);
  if (select credits_used from public.booking_credits where id = first_credit) <> 1 then
    raise exception 'New unpaid cancellation refunded another booking credit';
  end if;

  perform public.record_calcom_booking('BOOKING_CANCELLED', 'fixture-paid', null, null, null);
  perform public.record_calcom_booking('BOOKING_CANCELLED', 'fixture-paid', null, null, null);
  perform public.record_calcom_booking('BOOKING_CREATED', 'fixture-paid', null,
    student, '2026-11-03T15:00:00Z');
  if (select credits_used from public.booking_credits where id = first_credit) <> 0
    or not exists (select 1 from public.bookings where id = paid_booking
      and status = 'cancelled' and credit_id is null) then
    raise exception 'Exact cancellation, duplicate cancel, or late create replay corrupted credit';
  end if;

  result := public.record_calcom_booking('BOOKING_CREATED', 'fixture-original-uid', null,
    student, '2026-11-05T15:00:00Z');
  rescheduled_booking := (result->>'booking_id')::uuid;
  frozen_notification := result->'notification';
  perform public.record_calcom_booking('BOOKING_RESCHEDULED', 'fixture-new-uid',
    'fixture-original-uid', student, '2026-11-06T15:00:00Z');
  perform public.record_calcom_booking('BOOKING_RESCHEDULED', 'fixture-newest-uid',
    'fixture-new-uid', student, '2026-11-07T15:00:00Z');
  perform public.record_calcom_booking('BOOKING_RESCHEDULED', 'fixture-new-uid',
    'fixture-original-uid', student, '2026-11-06T15:00:00Z');
  result := public.record_calcom_booking('BOOKING_CREATED', 'fixture-original-uid', null,
    student, '2026-11-05T15:00:00Z');
  if (result->>'booking_id')::uuid <> rescheduled_booking
    or result->'notification' is distinct from frozen_notification
    or (select credits_used from public.booking_credits where id = first_credit) <> 1
    or not exists (select 1 from public.bookings where id = rescheduled_booking
      and calcom_reference = 'fixture-newest-uid' and starts_at = '2026-11-07T15:00:00Z'
      and credit_id = first_credit) then
    raise exception 'Reschedule UID alias/replay changed the booking, credit, or notification body';
  end if;
  perform public.record_calcom_booking('BOOKING_CANCELLED', 'fixture-original-uid', null,
    null, null);
  if (select status from public.bookings where id = rescheduled_booking) <> 'scheduled' then
    raise exception 'Old UID cancellation cancelled the rescheduled session';
  end if;

  update public.bookings set owner_notified_at = now() where id = rescheduled_booking;
  result := public.record_calcom_booking('BOOKING_CREATED', 'fixture-newest-uid', null,
    student, '2026-11-07T15:00:00Z');
  if (result->>'notify_owner')::boolean then
    raise exception 'Already-notified booking requested duplicate notification';
  end if;
  update public.bookings set status = 'completed' where id = rescheduled_booking;
  perform public.record_calcom_booking('BOOKING_CREATED', 'fixture-newest-uid', null,
    student, '2026-11-07T15:00:00Z');
  if (select credits_used from public.booking_credits where id = first_credit) <> 1
    or (select status from public.bookings where id = rescheduled_booking) <> 'completed' then
    raise exception 'Completion or create replay refunded/reopened a completed session';
  end if;

  insert into public.payment_submissions(student_id, program, amount_cents, status)
    values (student, 'hour', 5000, 'approved') returning id into second_payment;
  select id into second_credit from public.booking_credits where payment_id = second_payment;
  result := public.record_calcom_booking('BOOKING_CREATED', 'fixture-second-credit', null,
    student, '2026-11-08T15:00:00Z');
  second_paid_booking := (result->>'booking_id')::uuid;
  if (select credit_id from public.bookings where id = second_paid_booking) is distinct from second_credit then
    raise exception 'Second booking did not associate the second credit';
  end if;
  perform public.record_calcom_booking('BOOKING_CANCELLED', 'fixture-second-credit', null,
    null, null);
  if (select credits_used from public.booking_credits where id = first_credit) <> 1
    or (select credits_used from public.booking_credits where id = second_credit) <> 0 then
    raise exception 'Cancellation did not refund the exact associated credit';
  end if;

  -- Exercise the full unique constraint and AFTER trigger directly: conflict
  -- replay must not run a second INSERT debit or reopen a completed booking.
  update public.booking_credits set credits_total = 2 where id = second_credit;
  insert into public.bookings(student_id, starts_at, calcom_reference, status)
    values (student, '2026-11-09T15:00:00Z', 'fixture-direct-upsert', 'scheduled')
    on conflict (calcom_reference) do update set starts_at = excluded.starts_at;
  insert into public.bookings(student_id, starts_at, calcom_reference, status)
    values (student, '2026-11-09T15:00:00Z', 'fixture-direct-upsert', 'scheduled')
    on conflict (calcom_reference) do update set starts_at = excluded.starts_at;
  if (select credits_used from public.booking_credits where id = second_credit) <> 1 then
    raise exception 'ON CONFLICT replay consumed an extra credit';
  end if;
end;
$$;
reset role;

select set_config('request.jwt.claim.role', 'authenticated', true);
select set_config('request.jwt.claim.sub', 'a440a111-0625-422b-9ccc-5cb9b2199002', true);
set local role authenticated;
do $$
begin
  begin
    perform public.record_calcom_booking('BOOKING_CREATED', 'fixture-forbidden', null,
      auth.uid(), now());
    raise exception 'Authenticated student could invoke the service-only booking RPC';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;
select 'No-payment bookings, exact credits/refunds, create/cancel/reschedule replay, immutable notification context, completion, unique inference, and service-only RPC checks passed' as result;
