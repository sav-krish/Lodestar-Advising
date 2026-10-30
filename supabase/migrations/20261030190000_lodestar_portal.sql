create extension if not exists pgcrypto;

create type public.app_role as enum ('student', 'admin');
create type public.payment_status as enum ('pending', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role public.app_role not null default 'student',
  created_at timestamptz not null default now()
);

create table public.payment_submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  program text not null check (program in ('hour', 'essay_package')),
  amount_cents integer not null check (amount_cents > 0),
  status public.payment_status not null default 'pending',
  receipt_path text,
  note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.booking_credits (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  payment_id uuid not null unique references public.payment_submissions(id) on delete restrict,
  credits_total integer not null default 1 check (credits_total > 0),
  credits_used integer not null default 0 check (credits_used >= 0 and credits_used <= credits_total),
  created_at timestamptz not null default now()
);

create table public.student_materials (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  file_name text not null,
  storage_path text not null unique,
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  starts_at timestamptz,
  calcom_reference text,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index payment_submissions_student_created_idx
  on public.payment_submissions (student_id, created_at desc);
create index payment_submissions_status_idx
  on public.payment_submissions (status, created_at desc);
create index booking_credits_student_idx
  on public.booking_credits (student_id);
create index student_materials_student_idx
  on public.student_materials (student_id, created_at desc);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, lower(new.email), coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.grant_hour_credit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'approved' and (old is null or old.status <> 'approved') and new.program = 'hour' then
    insert into public.booking_credits (student_id, payment_id)
    values (new.student_id, new.id)
    on conflict (payment_id) do nothing;
  end if;
  return new;
end;
$$;

create trigger on_payment_approved
  after insert or update of status on public.payment_submissions
  for each row execute procedure public.grant_hour_credit();

alter table public.profiles enable row level security;
alter table public.payment_submissions enable row level security;
alter table public.booking_credits enable row level security;
alter table public.student_materials enable row level security;
alter table public.bookings enable row level security;

create policy "Students read their profile"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
create policy "Admins update profiles"
  on public.profiles for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Students read their payments"
  on public.payment_submissions for select to authenticated
  using (student_id = auth.uid() or public.is_admin());
create policy "Students submit payments"
  on public.payment_submissions for insert to authenticated
  with check (student_id = auth.uid());
create policy "Admins review payments"
  on public.payment_submissions for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Students read their credits"
  on public.booking_credits for select to authenticated
  using (student_id = auth.uid() or public.is_admin());
create policy "Admins manage credits"
  on public.booking_credits for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Students manage their materials"
  on public.student_materials for all to authenticated
  using (student_id = auth.uid() or public.is_admin())
  with check (student_id = auth.uid() or public.is_admin());

create policy "Students read their bookings"
  on public.bookings for select to authenticated
  using (student_id = auth.uid() or public.is_admin());
create policy "Admins manage bookings"
  on public.bookings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('student-materials', 'student-materials', false)
on conflict (id) do nothing;

create policy "Students upload their materials"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'student-materials'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "Students read their materials"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'student-materials'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );
create policy "Students delete their materials"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'student-materials'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );

-- After the owner's account is created, run:
-- update public.profiles set role = 'admin' where lower(email) = lower('YOUR_OWNER_EMAIL');
