create or replace function public.consume_credit_for_booking()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'scheduled'
    and (tg_op = 'INSERT' or old.status <> 'scheduled') then
    update public.booking_credits
    set credits_used = credits_used + 1
    where id = (
      select id
      from public.booking_credits
      where student_id = new.student_id
        and credits_used < credits_total
      order by created_at
      for update skip locked
      limit 1
    );
  elsif new.status = 'cancelled'
    and tg_op = 'UPDATE'
    and old.status = 'scheduled' then
    update public.booking_credits
    set credits_used = greatest(credits_used - 1, 0)
    where id = (
      select id
      from public.booking_credits
      where student_id = new.student_id
        and credits_used > 0
      order by created_at desc
      for update skip locked
      limit 1
    );
  end if;
  return new;
end;
$$;
