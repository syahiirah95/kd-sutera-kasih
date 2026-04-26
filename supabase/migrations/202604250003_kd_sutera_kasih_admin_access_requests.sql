create table if not exists public.kd_sutera_kasih_admin_access_requests (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  status text not null default 'pending',
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  constraint kd_sutera_kasih_admin_access_requests_status_check
    check (status in ('pending', 'approved', 'rejected'))
);

alter table public.kd_sutera_kasih_admin_access_requests enable row level security;

drop policy if exists kd_sutera_kasih_admin_access_requests_select on public.kd_sutera_kasih_admin_access_requests;
create policy kd_sutera_kasih_admin_access_requests_select
on public.kd_sutera_kasih_admin_access_requests
for select
using (auth_user_id = auth.uid() or public.kd_sutera_kasih_is_admin(auth.uid()));

drop policy if exists kd_sutera_kasih_admin_access_requests_insert_own on public.kd_sutera_kasih_admin_access_requests;
create policy kd_sutera_kasih_admin_access_requests_insert_own
on public.kd_sutera_kasih_admin_access_requests
for insert
with check (auth_user_id = auth.uid());

drop policy if exists kd_sutera_kasih_admin_access_requests_update_admin on public.kd_sutera_kasih_admin_access_requests;
create policy kd_sutera_kasih_admin_access_requests_update_admin
on public.kd_sutera_kasih_admin_access_requests
for update
using (public.kd_sutera_kasih_is_admin(auth.uid()))
with check (public.kd_sutera_kasih_is_admin(auth.uid()));

drop policy if exists kd_sutera_kasih_admin_users_insert_admin on public.kd_sutera_kasih_admin_users;
create policy kd_sutera_kasih_admin_users_insert_admin
on public.kd_sutera_kasih_admin_users
for insert
with check (public.kd_sutera_kasih_is_admin(auth.uid()));

drop policy if exists kd_sutera_kasih_admin_users_update_admin on public.kd_sutera_kasih_admin_users;
create policy kd_sutera_kasih_admin_users_update_admin
on public.kd_sutera_kasih_admin_users
for update
using (public.kd_sutera_kasih_is_admin(auth.uid()))
with check (public.kd_sutera_kasih_is_admin(auth.uid()));
