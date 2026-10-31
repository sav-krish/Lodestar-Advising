-- Pin the requested, verified owner account and keep payment review server-controlled.
create schema if not exists portal_private;
revoke all on schema portal_private from public, anon, authenticated;

create table if not exists portal_private.owner_identity (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null unique references auth.users(id) on delete restrict
);
revoke all on portal_private.owner_identity from public, anon, authenticated;

insert into portal_private.owner_identity(singleton, user_id)
select true, id from auth.users
where lower(email) = 'sav.krish01@gmail.com' and email_confirmed_at is not null
on conflict (singleton) do nothing;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from portal_private.owner_identity owner
    join auth.users account on account.id = owner.user_id
    where owner.user_id = auth.uid() and account.email_confirmed_at is not null
  );
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated, service_role;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if lower(new.email) = 'sav.krish01@gmail.com' and new.email_confirmed_at is not null then
    insert into portal_private.owner_identity(singleton, user_id)
    values (true, new.id) on conflict (singleton) do nothing;
  end if;
  insert into public.profiles(id, email, full_name, role)
  values (
    new.id, lower(new.email),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    case when exists (select 1 from portal_private.owner_identity where user_id = new.id)
      then 'admin'::public.app_role else 'student'::public.app_role end
  )
  on conflict (id) do update set email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name), role = excluded.role;
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_confirmed on auth.users;
create trigger on_auth_user_confirmed
after update of email, email_confirmed_at on auth.users
for each row execute function public.handle_new_user();

update public.profiles set role = case
  when id in (select user_id from portal_private.owner_identity)
  then 'admin'::public.app_role else 'student'::public.app_role end;

create or replace function portal_private.enforce_profile_role()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  new.role := case when exists (
    select 1 from portal_private.owner_identity owner
    join auth.users account on account.id = owner.user_id
    where owner.user_id = new.id and account.email_confirmed_at is not null
  ) then 'admin'::public.app_role else 'student'::public.app_role end;
  return new;
end;
$$;
revoke all on function portal_private.enforce_profile_role() from public, anon, authenticated;
create trigger enforce_portal_profile_role before insert or update on public.profiles
for each row execute function portal_private.enforce_profile_role();

create or replace function portal_private.enforce_student_payment_report()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if auth.role() = 'authenticated' and not public.is_admin() then
    new.status := 'pending';
    new.reviewed_at := null;
    new.created_at := now();
    new.amount_cents := case new.program
      when 'essay_package' then 55000
      when 'hour' then case when (now() at time zone 'America/Chicago')::date >= date '2026-11-16'
        then 6000 else 5000 end
      else null end;
    if not exists (select 1 from public.payment_submissions where student_id = auth.uid()) then
      if new.receipt_path is null or not exists (
        select 1 from storage.objects
        where bucket_id = 'student-materials' and name = new.receipt_path
          and split_part(name, '/', 1) = auth.uid()::text
      ) then
        raise exception 'Your first payment confirmation requires an uploaded receipt.' using errcode = '23514';
      end if;
    end if;
  end if;
  return new;
end;
$$;
revoke all on function portal_private.enforce_student_payment_report() from public, anon, authenticated;
create trigger enforce_student_payment_report before insert on public.payment_submissions
for each row execute function portal_private.enforce_student_payment_report();

notify pgrst, 'reload schema';
