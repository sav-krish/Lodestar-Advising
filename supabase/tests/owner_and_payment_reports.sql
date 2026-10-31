-- Run inside a rollback-only transaction after the owner/report migration.
-- Synthetic rows only; no messages, bookings, or bank transfers are sent.
insert into auth.users(id,email,email_confirmed_at,raw_user_meta_data)
values ('a440a111-0625-422b-9ccc-5cb9b2199001','lodestar-security-check@example.invalid',now(),'{}');

select set_config('request.jwt.claim.sub','a440a111-0625-422b-9ccc-5cb9b2199001',true);
select set_config('request.jwt.claim.role','authenticated',true);
set local role authenticated;
do $$
begin
  if public.is_admin() then raise exception 'Student received owner access'; end if;
  if (select count(*) from public.profiles) <> 1 then raise exception 'Cross-student profile access'; end if;
  begin
    insert into public.payment_submissions(student_id,program,amount_cents,status)
    values (auth.uid(),'hour',1,'approved');
    raise exception 'First payment accepted without a receipt';
  exception when check_violation then null;
  end;
end;
$$;
reset role;

-- A fixture Storage metadata row is rolled back; no file is published.
insert into storage.objects(bucket_id,name)
values ('student-materials','a440a111-0625-422b-9ccc-5cb9b2199001/receipts/security-test.png');
set local role authenticated;
do $$
declare report public.payment_submissions; expected_price integer;
begin
  insert into public.payment_submissions(student_id,program,amount_cents,status,receipt_path)
  values (auth.uid(),'hour',1,'approved',auth.uid()::text||'/receipts/security-test.png')
  returning * into report;
  expected_price := case when (now() at time zone 'America/Chicago')::date >= date '2026-11-16' then 6000 else 5000 end;
  if report.status <> 'pending' or report.amount_cents <> expected_price then
    raise exception 'Student can choose payment approval or price';
  end if;
  if exists(select 1 from public.booking_credits) then raise exception 'Student self-granted credit'; end if;
  insert into public.payment_submissions(student_id,program,amount_cents,status)
  values(auth.uid(),'essay_package',1,'approved') returning * into report;
  if report.status <> 'pending' or report.amount_cents <> 55000 then raise exception 'Essay price/review incorrect'; end if;
end;
$$;
reset role;

do $$
begin
  if exists(select 1 from auth.users where lower(email)='sav.krish01@gmail.com' and email_confirmed_at is not null)
    and not exists(select 1 from public.profiles p join portal_private.owner_identity o on o.user_id=p.id where p.role='admin')
  then raise exception 'Verified owner did not receive admin access'; end if;
  if exists(select 1 from public.profiles p where role='admin' and not exists (
    select 1 from portal_private.owner_identity o where o.user_id=p.id
  )) then raise exception 'Unpinned administrator'; end if;
end;
$$;
select 'Owner isolation, required first receipt, pending review, server pricing, later no-receipt report and credit protection passed' as result;
