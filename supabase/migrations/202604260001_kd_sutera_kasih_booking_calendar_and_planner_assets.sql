create or replace function public.kd_sutera_kasih_check_booking_conflict(
  p_venue_id uuid,
  p_event_date date,
  p_start_time time,
  p_end_time time,
  p_exclude_booking_id uuid default null
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.kd_sutera_kasih_bookings booking
    where booking.venue_id = p_venue_id
      and booking.event_date = p_event_date
      and booking.status in ('pending', 'approved')
      and (p_exclude_booking_id is null or booking.id <> p_exclude_booking_id)
  );
$$;

create or replace function public.kd_sutera_kasih_create_booking(p_payload jsonb)
returns table (
  id uuid,
  reference text,
  status public.kd_sutera_kasih_booking_status
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  selected_venue public.kd_sutera_kasih_venues%rowtype;
  next_reference text;
  created_booking_id uuid;
  payload_event_date date;
  payload_start_time time;
  payload_end_time time;
  payload_guest_count int;
  estimated_total int;
  full_payment int;
begin
  if current_user_id is null then
    raise exception 'Authentication is required to create a booking.';
  end if;

  select *
  into selected_venue
  from public.kd_sutera_kasih_venues venue
  where venue.slug = p_payload->>'venueSlug'
    and venue.is_active
  limit 1;

  if selected_venue.id is null then
    raise exception 'Venue not found.';
  end if;

  payload_event_date := (p_payload->>'eventDate')::date;
  payload_start_time := (p_payload->>'startTime')::time;
  payload_end_time := (p_payload->>'endTime')::time;
  payload_guest_count := nullif(p_payload->>'guestCount', '')::int;

  if payload_end_time <= payload_start_time then
    raise exception 'End time must be later than start time.';
  end if;

  if selected_venue.capacity_min is not null and payload_guest_count < selected_venue.capacity_min then
    raise exception 'Guest count is below the selected venue capacity range.';
  end if;

  if selected_venue.capacity_max is not null and payload_guest_count > selected_venue.capacity_max then
    raise exception 'Guest count exceeds the selected venue capacity range.';
  end if;

  if public.kd_sutera_kasih_check_booking_conflict(
    selected_venue.id,
    payload_event_date,
    payload_start_time,
    payload_end_time
  ) then
    raise exception 'This hall already has a pending or approved booking on that date.';
  end if;

  estimated_total := selected_venue.hall_package + selected_venue.furniture_package + selected_venue.props_package;
  full_payment := greatest(estimated_total - selected_venue.deposit_amount, 0);
  next_reference := public.kd_sutera_kasih_generate_booking_reference();

  insert into public.kd_sutera_kasih_bookings (
    reference,
    user_id,
    venue_id,
    venue_slug,
    venue_name_snapshot,
    event_type,
    event_date,
    start_time,
    end_time,
    time_slot_label,
    guest_count,
    contact_name,
    contact_email,
    contact_phone,
    organization,
    theme_style,
    setup_notes,
    special_requests,
    payment_method,
    deposit_amount,
    full_payment_amount,
    hall_package_amount,
    furniture_package_amount,
    props_package_amount,
    estimated_total_amount,
    deposit_status,
    full_payment_status
  )
  values (
    next_reference,
    current_user_id,
    selected_venue.id,
    selected_venue.slug,
    selected_venue.name,
    p_payload->>'eventType',
    payload_event_date,
    payload_start_time,
    payload_end_time,
    public.kd_sutera_kasih_format_time_label(payload_start_time, payload_end_time),
    payload_guest_count,
    p_payload->>'contactName',
    p_payload->>'contactEmail',
    p_payload->>'phoneNumber',
    nullif(p_payload->>'organization', ''),
    nullif(p_payload->>'themeStyle', ''),
    nullif(p_payload->>'vendorNotes', ''),
    nullif(p_payload->>'specialRequests', ''),
    nullif(p_payload->>'paymentMethod', ''),
    selected_venue.deposit_amount,
    full_payment,
    selected_venue.hall_package,
    selected_venue.furniture_package,
    selected_venue.props_package,
    estimated_total,
    'not_paid',
    'not_paid'
  )
  returning kd_sutera_kasih_bookings.id into created_booking_id;

  insert into public.kd_sutera_kasih_booking_status_events (
    booking_id,
    from_status,
    to_status,
    reason
  )
  values (
    created_booking_id,
    null,
    'pending',
    'Booking request submitted.'
  );

  return query
  select
    booking.id,
    booking.reference,
    booking.status
  from public.kd_sutera_kasih_bookings booking
  where booking.id = created_booking_id;
end;
$$;

create or replace function public.kd_sutera_kasih_booking_calendar_overview()
returns table (
  id uuid,
  venue_slug text,
  venue_name text,
  event_date date,
  time_slot_label text,
  status public.kd_sutera_kasih_booking_status
)
language sql
security definer
set search_path = public
as $$
  select
    booking.id,
    booking.venue_slug,
    booking.venue_name_snapshot as venue_name,
    booking.event_date,
    booking.time_slot_label,
    booking.status
  from public.kd_sutera_kasih_bookings booking
  inner join public.kd_sutera_kasih_venues venue
    on venue.slug = booking.venue_slug
  where booking.status in ('pending', 'approved')
    and venue.is_active = true
  order by booking.event_date asc, booking.time_slot_label asc;
$$;

grant execute on function public.kd_sutera_kasih_booking_calendar_overview() to anon;
grant execute on function public.kd_sutera_kasih_booking_calendar_overview() to authenticated;

create table if not exists public.kd_sutera_kasih_planner_assets (
  planner_item_id text primary key,
  label text not null,
  bucket_id text not null default 'kd_sutera_kasih_planner_assets',
  model_storage_path text,
  model_public_url text,
  model_filename text,
  thumbnail_storage_path text,
  thumbnail_public_url text,
  thumbnail_filename text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.kd_sutera_kasih_planner_assets enable row level security;

grant select on public.kd_sutera_kasih_planner_assets to anon;
grant select on public.kd_sutera_kasih_planner_assets to authenticated;
grant insert, update, delete on public.kd_sutera_kasih_planner_assets to authenticated;

drop policy if exists kd_sutera_kasih_planner_assets_select_public on public.kd_sutera_kasih_planner_assets;
create policy kd_sutera_kasih_planner_assets_select_public
on public.kd_sutera_kasih_planner_assets
for select
using (is_active or public.kd_sutera_kasih_is_admin(auth.uid()));

drop policy if exists kd_sutera_kasih_planner_assets_insert_admin on public.kd_sutera_kasih_planner_assets;
create policy kd_sutera_kasih_planner_assets_insert_admin
on public.kd_sutera_kasih_planner_assets
for insert
with check (public.kd_sutera_kasih_is_admin(auth.uid()));

drop policy if exists kd_sutera_kasih_planner_assets_update_admin on public.kd_sutera_kasih_planner_assets;
create policy kd_sutera_kasih_planner_assets_update_admin
on public.kd_sutera_kasih_planner_assets
for update
using (public.kd_sutera_kasih_is_admin(auth.uid()))
with check (public.kd_sutera_kasih_is_admin(auth.uid()));

drop policy if exists kd_sutera_kasih_planner_assets_delete_admin on public.kd_sutera_kasih_planner_assets;
create policy kd_sutera_kasih_planner_assets_delete_admin
on public.kd_sutera_kasih_planner_assets
for delete
using (public.kd_sutera_kasih_is_admin(auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'kd_sutera_kasih_planner_assets',
  'kd_sutera_kasih_planner_assets',
  true,
  52428800,
  array['model/gltf-binary', 'application/octet-stream', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists kd_sutera_kasih_planner_assets_storage_select_public on storage.objects;
create policy kd_sutera_kasih_planner_assets_storage_select_public
on storage.objects
for select
using (bucket_id = 'kd_sutera_kasih_planner_assets');

drop policy if exists kd_sutera_kasih_planner_assets_storage_insert_admin on storage.objects;
create policy kd_sutera_kasih_planner_assets_storage_insert_admin
on storage.objects
for insert
with check (
  bucket_id = 'kd_sutera_kasih_planner_assets'
  and public.kd_sutera_kasih_is_admin(auth.uid())
);

drop policy if exists kd_sutera_kasih_planner_assets_storage_update_admin on storage.objects;
create policy kd_sutera_kasih_planner_assets_storage_update_admin
on storage.objects
for update
using (
  bucket_id = 'kd_sutera_kasih_planner_assets'
  and public.kd_sutera_kasih_is_admin(auth.uid())
)
with check (
  bucket_id = 'kd_sutera_kasih_planner_assets'
  and public.kd_sutera_kasih_is_admin(auth.uid())
);

drop policy if exists kd_sutera_kasih_planner_assets_storage_delete_admin on storage.objects;
create policy kd_sutera_kasih_planner_assets_storage_delete_admin
on storage.objects
for delete
using (
  bucket_id = 'kd_sutera_kasih_planner_assets'
  and public.kd_sutera_kasih_is_admin(auth.uid())
);
