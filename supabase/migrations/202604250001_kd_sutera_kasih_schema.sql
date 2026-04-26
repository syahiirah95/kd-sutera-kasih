create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'kd_sutera_kasih_booking_status') then
    create type public.kd_sutera_kasih_booking_status as enum (
      'pending',
      'approved',
      'rejected',
      'cancelled',
      'completed'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'kd_sutera_kasih_payment_status') then
    create type public.kd_sutera_kasih_payment_status as enum (
      'not_paid',
      'pending',
      'paid'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'kd_sutera_kasih_venue_media_type') then
    create type public.kd_sutera_kasih_venue_media_type as enum (
      'hero_image',
      'gallery_image',
      'booking_video',
      'thumbnail'
    );
  end if;
end $$;

create sequence if not exists public.kd_sutera_kasih_booking_reference_seq;

create table if not exists public.kd_sutera_kasih_user_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  display_name text,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.kd_sutera_kasih_admin_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  role text not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint kd_sutera_kasih_admin_users_role_check check (role in ('admin', 'owner'))
);

create table if not exists public.kd_sutera_kasih_venues (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  badge_label text,
  state text not null,
  address text not null,
  capacity_min int,
  capacity_max int,
  capacity_label text not null,
  description text not null,
  intro text not null,
  gallery_title text,
  contact_email text,
  contact_phone text,
  operating_hours text,
  facilities text[] not null default '{}',
  policies text[] not null default '{}',
  latitude numeric,
  longitude numeric,
  map_embed_url text,
  deposit_amount int not null default 0,
  hall_package int not null default 0,
  furniture_package int not null default 0,
  props_package int not null default 0,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.kd_sutera_kasih_venue_media (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.kd_sutera_kasih_venues(id) on delete cascade,
  media_type public.kd_sutera_kasih_venue_media_type not null,
  bucket_id text not null default 'kd_sutera_kasih_venue_media',
  storage_path text not null,
  public_url text,
  alt_text text not null default '',
  caption text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint kd_sutera_kasih_venue_media_unique_path unique (bucket_id, storage_path)
);

create table if not exists public.kd_sutera_kasih_bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  venue_id uuid not null references public.kd_sutera_kasih_venues(id),
  venue_slug text not null,
  venue_name_snapshot text not null,
  event_type text not null,
  event_date date not null,
  start_time time not null,
  end_time time not null,
  time_slot_label text not null,
  guest_count int not null,
  contact_name text not null,
  contact_email text not null,
  contact_phone text not null,
  organization text,
  theme_style text,
  setup_notes text,
  special_requests text,
  payment_method text,
  status public.kd_sutera_kasih_booking_status not null default 'pending',
  status_reason text,
  admin_notes text,
  deposit_amount int not null default 0,
  full_payment_amount int not null default 0,
  hall_package_amount int not null default 0,
  furniture_package_amount int not null default 0,
  props_package_amount int not null default 0,
  estimated_total_amount int not null default 0,
  deposit_status public.kd_sutera_kasih_payment_status not null default 'pending',
  full_payment_status public.kd_sutera_kasih_payment_status not null default 'not_paid',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz not null default now(),
  approved_at timestamptz,
  rejected_at timestamptz,
  cancelled_at timestamptz,
  constraint kd_sutera_kasih_bookings_guest_count_check check (guest_count > 0),
  constraint kd_sutera_kasih_bookings_time_check check (end_time > start_time)
);

create table if not exists public.kd_sutera_kasih_booking_layouts (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.kd_sutera_kasih_bookings(id) on delete cascade,
  layout_json jsonb not null default '{}',
  object_count int not null default 0,
  preview_image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.kd_sutera_kasih_booking_status_events (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.kd_sutera_kasih_bookings(id) on delete cascade,
  from_status public.kd_sutera_kasih_booking_status,
  to_status public.kd_sutera_kasih_booking_status not null,
  reason text,
  actor_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.kd_sutera_kasih_booking_admin_notes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.kd_sutera_kasih_bookings(id) on delete cascade,
  note text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.kd_sutera_kasih_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists kd_sutera_kasih_user_profiles_touch_updated_at on public.kd_sutera_kasih_user_profiles;
create trigger kd_sutera_kasih_user_profiles_touch_updated_at
before update on public.kd_sutera_kasih_user_profiles
for each row execute function public.kd_sutera_kasih_touch_updated_at();

drop trigger if exists kd_sutera_kasih_admin_users_touch_updated_at on public.kd_sutera_kasih_admin_users;
create trigger kd_sutera_kasih_admin_users_touch_updated_at
before update on public.kd_sutera_kasih_admin_users
for each row execute function public.kd_sutera_kasih_touch_updated_at();

drop trigger if exists kd_sutera_kasih_venues_touch_updated_at on public.kd_sutera_kasih_venues;
create trigger kd_sutera_kasih_venues_touch_updated_at
before update on public.kd_sutera_kasih_venues
for each row execute function public.kd_sutera_kasih_touch_updated_at();

drop trigger if exists kd_sutera_kasih_venue_media_touch_updated_at on public.kd_sutera_kasih_venue_media;
create trigger kd_sutera_kasih_venue_media_touch_updated_at
before update on public.kd_sutera_kasih_venue_media
for each row execute function public.kd_sutera_kasih_touch_updated_at();

drop trigger if exists kd_sutera_kasih_bookings_touch_updated_at on public.kd_sutera_kasih_bookings;
create trigger kd_sutera_kasih_bookings_touch_updated_at
before update on public.kd_sutera_kasih_bookings
for each row execute function public.kd_sutera_kasih_touch_updated_at();

drop trigger if exists kd_sutera_kasih_booking_layouts_touch_updated_at on public.kd_sutera_kasih_booking_layouts;
create trigger kd_sutera_kasih_booking_layouts_touch_updated_at
before update on public.kd_sutera_kasih_booking_layouts
for each row execute function public.kd_sutera_kasih_touch_updated_at();

create or replace function public.kd_sutera_kasih_is_admin(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.kd_sutera_kasih_admin_users admin_user
    where admin_user.auth_user_id = p_user_id
      and admin_user.role in ('admin', 'owner')
  );
$$;

create or replace function public.kd_sutera_kasih_generate_booking_reference()
returns text
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  next_number bigint;
begin
  next_number := nextval('public.kd_sutera_kasih_booking_reference_seq');
  return 'KD-SK-' || to_char(now(), 'YYYY') || '-' || lpad(next_number::text, 4, '0');
end;
$$;

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
      and booking.status = 'approved'
      and (p_exclude_booking_id is null or booking.id <> p_exclude_booking_id)
      and booking.start_time < p_end_time
      and booking.end_time > p_start_time
  );
$$;

create or replace function public.kd_sutera_kasih_format_time_label(
  p_start_time time,
  p_end_time time
)
returns text
language sql
immutable
as $$
  select to_char(p_start_time, 'FMHH12:MI AM') || ' - ' || to_char(p_end_time, 'FMHH12:MI AM');
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
    raise exception 'This venue already has an approved booking during that time.';
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
    nullif(p_payload->>'specialRequests', ''),
    nullif(p_payload->>'specialRequests', ''),
    nullif(p_payload->>'paymentMethod', ''),
    selected_venue.deposit_amount,
    full_payment,
    selected_venue.hall_package,
    selected_venue.furniture_package,
    selected_venue.props_package,
    estimated_total,
    'pending',
    'not_paid'
  )
  returning kd_sutera_kasih_bookings.id into created_booking_id;

  insert into public.kd_sutera_kasih_booking_status_events (
    booking_id,
    from_status,
    to_status,
    actor_user_id,
    reason
  )
  values (
    created_booking_id,
    null,
    'pending',
    current_user_id,
    'Booking request submitted.'
  );

  return query
  select booking.id, booking.reference, booking.status
  from public.kd_sutera_kasih_bookings booking
  where booking.id = created_booking_id;
end;
$$;

create or replace function public.kd_sutera_kasih_update_booking_status(
  p_booking_id uuid,
  p_next_status public.kd_sutera_kasih_booking_status,
  p_reason text default null
)
returns public.kd_sutera_kasih_bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_booking public.kd_sutera_kasih_bookings%rowtype;
  updated_booking public.kd_sutera_kasih_bookings%rowtype;
begin
  if not public.kd_sutera_kasih_is_admin(current_user_id) then
    raise exception 'Admin access is required.';
  end if;

  select *
  into current_booking
  from public.kd_sutera_kasih_bookings
  where id = p_booking_id
  for update;

  if current_booking.id is null then
    raise exception 'Booking not found.';
  end if;

  if p_next_status = 'approved' and public.kd_sutera_kasih_check_booking_conflict(
    current_booking.venue_id,
    current_booking.event_date,
    current_booking.start_time,
    current_booking.end_time,
    current_booking.id
  ) then
    raise exception 'Another approved booking already uses this slot.';
  end if;

  update public.kd_sutera_kasih_bookings
  set
    status = p_next_status,
    status_reason = p_reason,
    approved_at = case when p_next_status = 'approved' then now() else approved_at end,
    rejected_at = case when p_next_status = 'rejected' then now() else rejected_at end,
    cancelled_at = case when p_next_status = 'cancelled' then now() else cancelled_at end
  where id = p_booking_id
  returning * into updated_booking;

  insert into public.kd_sutera_kasih_booking_status_events (
    booking_id,
    from_status,
    to_status,
    reason,
    actor_user_id
  )
  values (
    p_booking_id,
    current_booking.status,
    p_next_status,
    p_reason,
    current_user_id
  );

  return updated_booking;
end;
$$;

create or replace function public.kd_sutera_kasih_update_booking_payment_summary(
  p_booking_id uuid,
  p_deposit_status public.kd_sutera_kasih_payment_status default null,
  p_full_payment_status public.kd_sutera_kasih_payment_status default null
)
returns public.kd_sutera_kasih_bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  updated_booking public.kd_sutera_kasih_bookings%rowtype;
begin
  if not public.kd_sutera_kasih_is_admin(current_user_id) then
    raise exception 'Admin access is required.';
  end if;

  update public.kd_sutera_kasih_bookings
  set
    deposit_status = coalesce(p_deposit_status, deposit_status),
    full_payment_status = coalesce(p_full_payment_status, full_payment_status)
  where id = p_booking_id
  returning * into updated_booking;

  if updated_booking.id is null then
    raise exception 'Booking not found.';
  end if;

  return updated_booking;
end;
$$;

create or replace view public.kd_sutera_kasih_admin_booking_overview
with (security_invoker = true)
as
select
  booking.id,
  booking.reference,
  booking.user_id,
  booking.contact_name,
  booking.contact_email,
  booking.contact_phone,
  booking.created_at,
  booking.submitted_at,
  booking.deposit_amount,
  booking.deposit_status,
  booking.event_date,
  booking.event_type,
  booking.full_payment_amount,
  booking.full_payment_status,
  booking.guest_count,
  coalesce(layout.object_count, 0) as layout_objects,
  booking.setup_notes,
  booking.special_requests,
  booking.status,
  booking.status_reason,
  booking.time_slot_label,
  booking.venue_id,
  booking.venue_slug,
  booking.venue_name_snapshot as venue_name
from public.kd_sutera_kasih_bookings booking
left join public.kd_sutera_kasih_booking_layouts layout
  on layout.booking_id = booking.id;

create or replace view public.kd_sutera_kasih_user_booking_overview
with (security_invoker = true)
as
select
  booking.id,
  booking.reference,
  booking.user_id,
  booking.event_date,
  booking.event_type,
  booking.time_slot_label,
  booking.guest_count,
  booking.status,
  booking.deposit_amount,
  booking.deposit_status,
  booking.full_payment_amount,
  booking.full_payment_status,
  booking.estimated_total_amount,
  booking.venue_slug,
  booking.venue_name_snapshot as venue_name,
  booking.created_at,
  booking.submitted_at
from public.kd_sutera_kasih_bookings booking;

create unique index if not exists kd_sutera_kasih_admin_users_auth_user_id_idx
  on public.kd_sutera_kasih_admin_users(auth_user_id);
create index if not exists kd_sutera_kasih_venue_media_venue_type_idx
  on public.kd_sutera_kasih_venue_media(venue_id, media_type, sort_order);
create index if not exists kd_sutera_kasih_bookings_user_id_idx
  on public.kd_sutera_kasih_bookings(user_id);
create index if not exists kd_sutera_kasih_bookings_venue_date_idx
  on public.kd_sutera_kasih_bookings(venue_id, event_date);
create index if not exists kd_sutera_kasih_bookings_status_idx
  on public.kd_sutera_kasih_bookings(status);
create index if not exists kd_sutera_kasih_bookings_created_at_idx
  on public.kd_sutera_kasih_bookings(created_at desc);
create unique index if not exists kd_sutera_kasih_bookings_reference_idx
  on public.kd_sutera_kasih_bookings(reference);
create index if not exists kd_sutera_kasih_booking_status_events_booking_id_idx
  on public.kd_sutera_kasih_booking_status_events(booking_id);
create index if not exists kd_sutera_kasih_bookings_approved_slot_idx
  on public.kd_sutera_kasih_bookings(venue_id, event_date, start_time, end_time)
  where status = 'approved';

alter table public.kd_sutera_kasih_user_profiles enable row level security;
alter table public.kd_sutera_kasih_admin_users enable row level security;
alter table public.kd_sutera_kasih_venues enable row level security;
alter table public.kd_sutera_kasih_venue_media enable row level security;
alter table public.kd_sutera_kasih_bookings enable row level security;
alter table public.kd_sutera_kasih_booking_layouts enable row level security;
alter table public.kd_sutera_kasih_booking_status_events enable row level security;
alter table public.kd_sutera_kasih_booking_admin_notes enable row level security;

drop policy if exists kd_sutera_kasih_user_profiles_select_own on public.kd_sutera_kasih_user_profiles;
create policy kd_sutera_kasih_user_profiles_select_own
on public.kd_sutera_kasih_user_profiles
for select
using (auth_user_id = auth.uid() or public.kd_sutera_kasih_is_admin(auth.uid()));

drop policy if exists kd_sutera_kasih_user_profiles_update_own on public.kd_sutera_kasih_user_profiles;
create policy kd_sutera_kasih_user_profiles_update_own
on public.kd_sutera_kasih_user_profiles
for update
using (auth_user_id = auth.uid())
with check (auth_user_id = auth.uid());

drop policy if exists kd_sutera_kasih_admin_users_select_authorized on public.kd_sutera_kasih_admin_users;
create policy kd_sutera_kasih_admin_users_select_authorized
on public.kd_sutera_kasih_admin_users
for select
using (auth_user_id = auth.uid() or public.kd_sutera_kasih_is_admin(auth.uid()));

drop policy if exists kd_sutera_kasih_venues_select_active on public.kd_sutera_kasih_venues;
create policy kd_sutera_kasih_venues_select_active
on public.kd_sutera_kasih_venues
for select
using (is_active or public.kd_sutera_kasih_is_admin(auth.uid()));

drop policy if exists kd_sutera_kasih_venues_insert_admin on public.kd_sutera_kasih_venues;
create policy kd_sutera_kasih_venues_insert_admin
on public.kd_sutera_kasih_venues
for insert
with check (public.kd_sutera_kasih_is_admin(auth.uid()));

drop policy if exists kd_sutera_kasih_venues_update_admin on public.kd_sutera_kasih_venues;
create policy kd_sutera_kasih_venues_update_admin
on public.kd_sutera_kasih_venues
for update
using (public.kd_sutera_kasih_is_admin(auth.uid()))
with check (public.kd_sutera_kasih_is_admin(auth.uid()));

drop policy if exists kd_sutera_kasih_venue_media_select_active on public.kd_sutera_kasih_venue_media;
create policy kd_sutera_kasih_venue_media_select_active
on public.kd_sutera_kasih_venue_media
for select
using (
  public.kd_sutera_kasih_is_admin(auth.uid())
  or (
    is_active
    and exists (
      select 1
      from public.kd_sutera_kasih_venues venue
      where venue.id = kd_sutera_kasih_venue_media.venue_id
        and venue.is_active
    )
  )
);

drop policy if exists kd_sutera_kasih_venue_media_insert_admin on public.kd_sutera_kasih_venue_media;
create policy kd_sutera_kasih_venue_media_insert_admin
on public.kd_sutera_kasih_venue_media
for insert
with check (public.kd_sutera_kasih_is_admin(auth.uid()));

drop policy if exists kd_sutera_kasih_venue_media_update_admin on public.kd_sutera_kasih_venue_media;
create policy kd_sutera_kasih_venue_media_update_admin
on public.kd_sutera_kasih_venue_media
for update
using (public.kd_sutera_kasih_is_admin(auth.uid()))
with check (public.kd_sutera_kasih_is_admin(auth.uid()));

drop policy if exists kd_sutera_kasih_bookings_select_own_or_admin on public.kd_sutera_kasih_bookings;
create policy kd_sutera_kasih_bookings_select_own_or_admin
on public.kd_sutera_kasih_bookings
for select
using (user_id = auth.uid() or public.kd_sutera_kasih_is_admin(auth.uid()));

drop policy if exists kd_sutera_kasih_bookings_update_admin on public.kd_sutera_kasih_bookings;
create policy kd_sutera_kasih_bookings_update_admin
on public.kd_sutera_kasih_bookings
for update
using (public.kd_sutera_kasih_is_admin(auth.uid()))
with check (public.kd_sutera_kasih_is_admin(auth.uid()));

drop policy if exists kd_sutera_kasih_booking_layouts_select_own_or_admin on public.kd_sutera_kasih_booking_layouts;
create policy kd_sutera_kasih_booking_layouts_select_own_or_admin
on public.kd_sutera_kasih_booking_layouts
for select
using (
  public.kd_sutera_kasih_is_admin(auth.uid())
  or exists (
    select 1
    from public.kd_sutera_kasih_bookings booking
    where booking.id = kd_sutera_kasih_booking_layouts.booking_id
      and booking.user_id = auth.uid()
  )
);

drop policy if exists kd_sutera_kasih_booking_status_events_select_own_or_admin on public.kd_sutera_kasih_booking_status_events;
create policy kd_sutera_kasih_booking_status_events_select_own_or_admin
on public.kd_sutera_kasih_booking_status_events
for select
using (
  public.kd_sutera_kasih_is_admin(auth.uid())
  or exists (
    select 1
    from public.kd_sutera_kasih_bookings booking
    where booking.id = kd_sutera_kasih_booking_status_events.booking_id
      and booking.user_id = auth.uid()
  )
);

drop policy if exists kd_sutera_kasih_booking_admin_notes_select_admin on public.kd_sutera_kasih_booking_admin_notes;
create policy kd_sutera_kasih_booking_admin_notes_select_admin
on public.kd_sutera_kasih_booking_admin_notes
for select
using (public.kd_sutera_kasih_is_admin(auth.uid()));

drop policy if exists kd_sutera_kasih_booking_admin_notes_insert_admin on public.kd_sutera_kasih_booking_admin_notes;
create policy kd_sutera_kasih_booking_admin_notes_insert_admin
on public.kd_sutera_kasih_booking_admin_notes
for insert
with check (public.kd_sutera_kasih_is_admin(auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'kd_sutera_kasih_venue_media',
  'kd_sutera_kasih_venue_media',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists kd_sutera_kasih_venue_media_storage_select_public on storage.objects;
create policy kd_sutera_kasih_venue_media_storage_select_public
on storage.objects
for select
using (bucket_id = 'kd_sutera_kasih_venue_media');

drop policy if exists kd_sutera_kasih_venue_media_storage_insert_admin on storage.objects;
create policy kd_sutera_kasih_venue_media_storage_insert_admin
on storage.objects
for insert
with check (
  bucket_id = 'kd_sutera_kasih_venue_media'
  and public.kd_sutera_kasih_is_admin(auth.uid())
);

drop policy if exists kd_sutera_kasih_venue_media_storage_update_admin on storage.objects;
create policy kd_sutera_kasih_venue_media_storage_update_admin
on storage.objects
for update
using (
  bucket_id = 'kd_sutera_kasih_venue_media'
  and public.kd_sutera_kasih_is_admin(auth.uid())
)
with check (
  bucket_id = 'kd_sutera_kasih_venue_media'
  and public.kd_sutera_kasih_is_admin(auth.uid())
);

drop policy if exists kd_sutera_kasih_venue_media_storage_delete_admin on storage.objects;
create policy kd_sutera_kasih_venue_media_storage_delete_admin
on storage.objects
for delete
using (
  bucket_id = 'kd_sutera_kasih_venue_media'
  and public.kd_sutera_kasih_is_admin(auth.uid())
);
