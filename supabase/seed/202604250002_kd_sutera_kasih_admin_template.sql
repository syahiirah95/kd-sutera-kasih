-- Replace the email below with the Supabase Auth user that should manage Sutera Kasih.
-- Run after the user has signed up or has been created in Supabase Auth.

insert into public.kd_sutera_kasih_admin_users (auth_user_id, role)
select auth_user.id, 'owner'
from auth.users auth_user
where auth_user.email = 'replace-with-admin-email@example.com'
on conflict (auth_user_id) do update
set role = excluded.role;
