# Supabase Integration Plan

This document defines the Supabase integration plan for Sutera Kasih Hall. The database is shared with other projects, so every project-owned database object must use the `kd_sutera_kasih_` prefix.

Scope for this phase:
- Replace mock booking/admin data with real Supabase data.
- Save booking submissions from logged-in users only.
- Let authenticated admins review real bookings, update booking status, and review payment status.
- Store venue hero/gallery images and per-hall booking videos in Supabase Storage so future venues can be managed from admin.
- Keep booking file storage out of scope. The frontend can generate receipts locally from table data.
- Keep payment integration out of scope because this is a bounty challenge build, not a production payment system.

## Naming Rule

All tables, views, functions, triggers, enums, policies, and indexes created for this app should start with `kd_sutera_kasih_`.

Examples:
- Table: `kd_sutera_kasih_bookings`
- Function: `kd_sutera_kasih_create_booking`
- Trigger: `kd_sutera_kasih_bookings_touch_updated_at`
- Policy: `kd_sutera_kasih_bookings_select_own`
- Index: `kd_sutera_kasih_bookings_event_date_idx`

Supabase Auth tables such as `auth.users` are shared platform tables and should not be renamed. Any app-owned profile or role data should live in prefixed tables.

## Data Model

### `kd_sutera_kasih_user_profiles`

Purpose: app-specific profile data linked to `auth.users`.

Columns:
- `id uuid primary key default gen_random_uuid()`
- `auth_user_id uuid unique references auth.users(id) on delete set null`
- `display_name text`
- `email text`
- `phone text`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Notes:
- This is separate from Supabase Auth metadata.
- Useful for account page and user booking ownership.
- No `on delete cascade` from `auth.users` is used here. If an auth user is removed, the app profile can keep a historical row with `auth_user_id = null`.
- Deleting this profile row must not delete anything in `auth.users` or any other app's data.

Cascade clarification:
- The only `on delete cascade` rules allowed in this plan are from this app's own parent rows to this app's own child rows, for example deleting one `kd_sutera_kasih_bookings` row can clean up its `kd_sutera_kasih_booking_layouts` row.
- No cascade should point from this app into shared or other-project tables.

### `kd_sutera_kasih_admin_users`

Purpose: app-specific admin authorization for Sutera Kasih only.

Columns:
- `id uuid primary key default gen_random_uuid()`
- `auth_user_id uuid unique references auth.users(id) on delete set null`
- `role text not null default 'admin'`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Checks:
- `role in ('admin', 'owner')`

Notes:
- No cascade from `auth.users`; deleting an auth user should set `auth_user_id` to null.
- This table belongs only to Sutera Kasih because of the `kd_sutera_kasih_` prefix.
- The profile menu can still show a simple admin login dialog, but the final authorization check must come from this table.

Contest requirement note:
- The bounty asks for an admin login page and admin dashboard, but does not require production-grade authorization.
- We will satisfy this with a polished login dialog popup when the user toggles to Admin.
- The dialog should ask the user to sign in first if they are not authenticated.
- If the signed-in user exists in `kd_sutera_kasih_admin_users`, unlock the admin dashboard.

### `kd_sutera_kasih_venues`

Purpose: move venue records from `lib/data/venues.ts` into Supabase, while keeping the frontend shape familiar.

Columns:
- `id uuid primary key default gen_random_uuid()`
- `slug text not null unique`
- `name text not null`
- `badge_label text`
- `state text not null`
- `address text not null`
- `capacity_min int`
- `capacity_max int`
- `capacity_label text not null`
- `description text not null`
- `intro text not null`
- `gallery_title text`
- `contact_email text`
- `contact_phone text`
- `operating_hours text`
- `facilities text[] not null default '{}'`
- `policies text[] not null default '{}'`
- `latitude numeric`
- `longitude numeric`
- `map_embed_url text`
- `deposit_amount int not null default 0`
- `hall_package int not null default 0`
- `furniture_package int not null default 0`
- `props_package int not null default 0`
- `is_active boolean not null default true`
- `sort_order int not null default 0`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Notes:
- Prices are stored as integer RM values for now.
- If cents are needed later, switch to sen-based integer fields.
- `badge_label` supports labels like "Premier Venue", "Romantic Venue", or similar hall differentiation in the hero pill.
- `map_embed_url` supports the compact Google Maps panel in venue details.

### `kd_sutera_kasih_venue_media`

Purpose: store hero image, gallery image, and booking video metadata for each venue.

Columns:
- `id uuid primary key default gen_random_uuid()`
- `venue_id uuid not null references kd_sutera_kasih_venues(id) on delete cascade`
- `media_type kd_sutera_kasih_venue_media_type not null`
- `bucket_id text not null default 'kd_sutera_kasih_venue_media'`
- `storage_path text not null`
- `public_url text`
- `alt_text text not null default ''`
- `caption text`
- `sort_order int not null default 0`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Enum:
- `kd_sutera_kasih_venue_media_type`: `hero_image`, `gallery_image`, `booking_video`, `thumbnail`

Notes:
- Current hero images live in `assets/event-gallery/*`.
- Current gallery images live in `public/venue-gallery/*`.
- Current venue video lives in `assets/bg/bg_video.mp4`.
- Supabase integration should move venue page hero/gallery images into this table and bucket.
- Venue pages should use `hero_image` and `gallery_image`.
- Booking pages should use each venue's `booking_video` when available.
- 3D planner objects remain out of Supabase Storage for now.
- A venue can have one active `hero_image`, one active `booking_video`, and multiple active `gallery_image` rows.
- `sort_order` controls carousel/gallery order.

### `kd_sutera_kasih_bookings`

Purpose: main booking request record.

Columns:
- `id uuid primary key default gen_random_uuid()`
- `reference text not null unique`
- `user_id uuid references auth.users(id) on delete set null`
- `venue_id uuid not null references kd_sutera_kasih_venues(id)`
- `venue_slug text not null`
- `venue_name_snapshot text not null`
- `event_type text not null`
- `event_date date not null`
- `start_time time not null`
- `end_time time not null`
- `time_slot_label text not null`
- `guest_count int not null`
- `contact_name text not null`
- `contact_email text not null`
- `contact_phone text not null`
- `organization text`
- `theme_style text`
- `setup_notes text`
- `special_requests text`
- `payment_method text`
- `status kd_sutera_kasih_booking_status not null default 'pending'`
- `status_reason text`
- `admin_notes text`
- `deposit_amount int not null default 0`
- `full_payment_amount int not null default 0`
- `hall_package_amount int not null default 0`
- `furniture_package_amount int not null default 0`
- `props_package_amount int not null default 0`
- `estimated_total_amount int not null default 0`
- `deposit_status kd_sutera_kasih_payment_status not null default 'pending'`
- `full_payment_status kd_sutera_kasih_payment_status not null default 'not_paid'`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `submitted_at timestamptz not null default now()`
- `approved_at timestamptz`
- `rejected_at timestamptz`
- `cancelled_at timestamptz`

Enums:
- `kd_sutera_kasih_booking_status`: `pending`, `approved`, `rejected`, `cancelled`, `completed`
- `kd_sutera_kasih_payment_status`: `not_paid`, `pending`, `paid`

Notes:
- Snapshot fields protect the booking from future venue price/name changes.
- `full_payment_amount` should usually equal `estimated_total_amount - deposit_amount`.
- Payment fields are status and amount tracking only. There is no real payment gateway integration.
- `setup_notes` maps from the booking flow layout/setup request textarea.
- `special_requests` remains available for future separated notes.

Payment tracking note:
- No separate payment table is planned for the first Supabase pass.
- Deposit and full payment status/amount can live directly on `kd_sutera_kasih_bookings`.
- Authenticated admins can update these summary fields.

### `kd_sutera_kasih_booking_layouts`

Purpose: save planner/layout data tied to a booking.

Columns:
- `id uuid primary key default gen_random_uuid()`
- `booking_id uuid not null unique references kd_sutera_kasih_bookings(id) on delete cascade`
- `layout_json jsonb not null default '{}'`
- `object_count int not null default 0`
- `preview_image_path text`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Notes:
- For the current UI, we can save an empty layout until the real planner save flow is wired.
- 3D object files are not part of this phase.

### `kd_sutera_kasih_booking_status_events`

Purpose: audit trail for booking status changes.

Columns:
- `id uuid primary key default gen_random_uuid()`
- `booking_id uuid not null references kd_sutera_kasih_bookings(id) on delete cascade`
- `from_status kd_sutera_kasih_booking_status`
- `to_status kd_sutera_kasih_booking_status not null`
- `reason text`
- `actor_user_id uuid references auth.users(id) on delete set null`
- `created_at timestamptz not null default now()`

Notes:
- Every approve/reject/cancel action should insert here.
- Admin detail modal can eventually show activity history.

### `kd_sutera_kasih_booking_admin_notes`

Purpose: internal notes without overwriting the current booking state.

Columns:
- `id uuid primary key default gen_random_uuid()`
- `booking_id uuid not null references kd_sutera_kasih_bookings(id) on delete cascade`
- `note text not null`
- `created_by uuid references auth.users(id) on delete set null`
- `created_at timestamptz not null default now()`

Notes:
- Optional for first implementation, but useful once admins need handoff context.

## Views

### `kd_sutera_kasih_admin_booking_overview`

Purpose: one convenient read model for the admin table.

Fields:
- booking id/reference/status
- customer name/email/phone
- venue name/slug/state
- event date/time/type/guest count
- deposit amount/status
- full payment amount/status
- layout object count
- created/submitted timestamps

### `kd_sutera_kasih_user_booking_overview`

Purpose: one convenient read model for the user `My Booking` page.

Fields:
- booking id/reference/status
- venue name
- event date/time/type
- deposit/full payment status
- estimated total
- created/submitted timestamps

## Functions

### `kd_sutera_kasih_generate_booking_reference()`

Returns `text`.

Format proposal:
- `KD-SK-YYYY-0001`

Purpose:
- Generate readable booking references.
- Should avoid collisions with `kd_sutera_kasih_bookings.reference`.

### `kd_sutera_kasih_check_booking_conflict(venue_id uuid, event_date date, start_time time, end_time time, exclude_booking_id uuid default null)`

Returns `boolean`.

Purpose:
- Detect overlapping approved bookings for the same venue and date.
- Used before booking creation and before approval.

Rule:
- Approved bookings hard-lock a slot.
- Pending bookings can coexist for review unless we decide to block them later.

### `kd_sutera_kasih_is_admin(user_id uuid)`

Returns `boolean`.

Purpose:
- Central admin permission check used by RLS policies and admin RPC functions.
- Returns true only if `user_id` exists in `kd_sutera_kasih_admin_users`.

### `kd_sutera_kasih_create_booking(payload jsonb)`

Returns created booking row or booking id/reference.

Purpose:
- Server-side creation point for public booking submissions.

Responsibilities:
- Validate required payload keys.
- Look up venue by slug.
- Snapshot venue name and prices.
- Calculate `estimated_total_amount` and `full_payment_amount`.
- Generate reference.
- Insert booking.
- Insert initial deposit payment event.
- Insert initial status event.
- Optionally insert layout record.

### `kd_sutera_kasih_update_booking_status(booking_id uuid, next_status kd_sutera_kasih_booking_status, reason text default null)`

Returns updated booking row.

Purpose:
- Admin-only approve/reject/cancel/complete action.

Responsibilities:
- Check `kd_sutera_kasih_is_admin(auth.uid())`.
- Recheck conflict before approval.
- Update booking status timestamps.
- Insert `kd_sutera_kasih_booking_status_events` row.

### `kd_sutera_kasih_update_booking_payment_summary(booking_id uuid, deposit_status kd_sutera_kasih_payment_status default null, full_payment_status kd_sutera_kasih_payment_status default null)`

Returns updated booking/payment summary.

Purpose:
- Admin-only payment status update.

Responsibilities:
- Check `kd_sutera_kasih_is_admin(auth.uid())`.
- Update `deposit_status` and/or `full_payment_status` on `kd_sutera_kasih_bookings`.
- Do not create real payment records.
- Do not integrate with a payment provider.

### `kd_sutera_kasih_touch_updated_at()`

Returns trigger.

Purpose:
- Shared trigger function for prefixed tables with `updated_at`.

## Indexes

Recommended indexes:
- `kd_sutera_kasih_admin_users_auth_user_id_idx` unique on `kd_sutera_kasih_admin_users(auth_user_id)`
- `kd_sutera_kasih_venue_media_venue_type_idx` on `kd_sutera_kasih_venue_media(venue_id, media_type, sort_order)`
- `kd_sutera_kasih_bookings_user_id_idx` on `kd_sutera_kasih_bookings(user_id)`
- `kd_sutera_kasih_bookings_venue_date_idx` on `kd_sutera_kasih_bookings(venue_id, event_date)`
- `kd_sutera_kasih_bookings_status_idx` on `kd_sutera_kasih_bookings(status)`
- `kd_sutera_kasih_bookings_created_at_idx` on `kd_sutera_kasih_bookings(created_at desc)`
- `kd_sutera_kasih_bookings_reference_idx` unique on `kd_sutera_kasih_bookings(reference)`
- `kd_sutera_kasih_booking_status_events_booking_id_idx` on `kd_sutera_kasih_booking_status_events(booking_id)`

Optional conflict helper:
- Partial index on approved bookings:
  `kd_sutera_kasih_bookings_approved_slot_idx` on `(venue_id, event_date, start_time, end_time)` where `status = 'approved'`.

## RLS Plan

Enable RLS on every app-owned table.

### Public/authenticated user access

`kd_sutera_kasih_venues`
- Anyone can select active venues.
- Authenticated admins can insert/update/deactivate venues for future expansion.

`kd_sutera_kasih_venue_media`
- Anyone can select active media for active venues.
- Authenticated admins can insert/update/deactivate venue media.
- Storage write access should be admin-only.

`kd_sutera_kasih_bookings`
- Authenticated users can select their own bookings.
- Authenticated users can create their own booking through `kd_sutera_kasih_create_booking`.
- Direct client insert should be avoided if we use RPC.
- Users cannot update status/payment fields.

`kd_sutera_kasih_booking_layouts`
- Users can select layouts for their own bookings.
- Users can insert/update layout only during booking submission or through a controlled RPC.

### Admin access

Admin UX:
- The profile menu Admin toggle opens a login dialog popup.
- If the user is not signed in, the dialog should prompt sign-in.
- If the user is signed in, check whether their `auth.uid()` exists in `kd_sutera_kasih_admin_users`.
- If the check passes, unlock the admin dashboard.
- If the check fails, show a concise "not authorized" state.

Database rules:
- Admins can select all Sutera Kasih booking/admin rows needed for the dashboard.
- Admins can update booking status/payment summary through guarded RPC functions.
- RLS and functions must use `kd_sutera_kasih_is_admin(auth.uid())`.
- Do not use the Supabase service role key for normal admin dashboard actions.

## Booking Flow Changes

Current state:
- `BookingRequestForm` stores form state in React.
- Pressing `Pay deposit` only sets submitted state.
- `BookingConfirmationStep` generates a browser-only PDF.

Target state:
1. Logged-in user completes booking form.
2. On final `Pay deposit`, call a server action or API route.
3. Server action validates with Zod.
4. Server action calls `kd_sutera_kasih_create_booking`.
5. Supabase returns `id` and `reference`.
6. Confirmation step displays the real reference.
7. PDF download uses the real reference and saved booking snapshot.

Fields to send from booking flow:
- authenticated `user_id` from Supabase Auth
- `venueSlug`
- `eventType`
- `eventDate`
- `startTime`
- `endTime`
- `guestCount`
- `contactName`
- `contactEmail`
- `phoneNumber`
- `organization`
- `themeStyle`
- `specialRequests`
- `paymentMethod`
- layout payload when available

## Admin Dashboard Changes

Current state:
- Uses `INITIAL_BOOKINGS` mock data.
- Approve/reject only updates React state.

Target state:
1. Fetch rows from `kd_sutera_kasih_admin_booking_overview`.
2. Keep status filter client-side first, or move to query params later.
3. `View` opens real booking detail.
4. Approve/reject buttons call `kd_sutera_kasih_update_booking_status`.
5. Deposit/full payment controls call `kd_sutera_kasih_update_booking_payment_summary`.
6. Refresh data after every mutation.

Dashboard additions after the first real-data pass:
- Search by reference/customer/email/phone.
- Filter by venue.
- Filter by payment status.
- Filter by event date range.
- Show conflict warning before approval.
- Add admin notes and reject reason.

## Venue Admin Changes

The current admin dashboard focuses on bookings. For future venue expansion, add a separate admin venue management surface.

Admin venue capabilities:
- Add venue.
- Edit venue details, capacity, facilities, operating hours, contact info, pricing, and map URL.
- Upload/change hero image.
- Upload/change booking video for that hall.
- Upload/reorder gallery images.
- Deactivate venue without deleting historical bookings.

Implementation note:
- Bookings should snapshot venue name and pricing, so editing a venue later does not rewrite old booking records.
- Deleting venues should generally be avoided. Prefer `is_active = false`.
- Admin media uploads should write the file to Supabase Storage first, then save/update the matching `kd_sutera_kasih_venue_media.storage_path`.
- Replacing a hero image or booking video should deactivate the old active row or mark the new row active and old row inactive.
- Reordering gallery images should update `sort_order`, not rename files.

## My Booking Page

The profile dropdown currently points `My Booking` to the booking route. Once bookings are persisted, create a real user booking page.

Route proposal:
- `/my-bookings`

Data source:
- `kd_sutera_kasih_user_booking_overview`

User should see:
- Reference
- Venue
- Event date/time
- Booking status
- Deposit status
- Full payment status
- Estimated total
- Contact/action note

## Storage Plan

### Venue media storage

Use Supabase Storage for venue media only.

Bucket:
- `kd_sutera_kasih_venue_media`

Suggested paths:
- `venues/{venue_slug}/hero/{filename}`
- `venues/{venue_slug}/gallery/{sort_order}-{filename}`
- `venues/{venue_slug}/booking-video/{filename}`

Access:
- Public read for active venue media.
- Admin-only upload/update/delete through RLS/storage policies.

Current media migration:
- Move hero images from `assets/event-gallery/*` into the venue media bucket.
- Move gallery images from `public/venue-gallery/*` into the venue media bucket.
- Venue page uses images only.
- Move or upload booking videos into the venue media bucket when available.
- Booking page uses `booking_video` for the selected hall, with the current local video as a fallback during migration.
- Planner/3D object assets stay local for now.

Receipt behavior:
- The frontend generates receipts/PDFs from saved booking table data.
- Receipts are not uploaded or stored.

No booking file storage:
- No receipt upload.
- No payment proof upload.
- No generated booking PDF storage.

Later, only if needed:
- Layout snapshot images.
- 3D asset storage after assets are finalized.

## Migration Order

1. Create enums.
2. Create core tables:
   - `kd_sutera_kasih_user_profiles`
   - `kd_sutera_kasih_admin_users`
   - `kd_sutera_kasih_venues`
   - `kd_sutera_kasih_venue_media`
   - `kd_sutera_kasih_bookings`
3. Create supporting tables:
   - `kd_sutera_kasih_booking_layouts`
   - `kd_sutera_kasih_booking_status_events`
   - `kd_sutera_kasih_booking_admin_notes`
4. Create functions.
5. Create triggers.
6. Create indexes.
7. Enable RLS and create policies.
8. Create Storage bucket and policies for `kd_sutera_kasih_venue_media`.
9. Seed venues from current `lib/data/venues.ts`.
10. Upload/seed current hero, gallery, and booking video media.
11. Replace frontend mock data with Supabase queries.
12. Add user booking page after the admin dashboard reads real data.

Seed rule:
- Seed venue records only.
- Seed venue media metadata after upload.
- Seed one `booking_video` per venue if the media exists. Otherwise, keep the current local fallback until each hall has its own uploaded video.
- Do not seed mock bookings. The admin dashboard should start empty and populate from real booking submissions.

## Implementation Phases

### Phase 1: Database foundation

Deliverables:
- SQL migration file.
- Venue seed script/SQL.
- Venue media bucket and seed instructions.
- RLS policies.
- RPC functions for create booking and admin mutations.

No UI changes yet except adding Supabase helper types if needed.

### Phase 2: Booking submission

Deliverables:
- Server action/API route for booking creation.
- Require a logged-in Supabase user before submission.
- Booking form submits to Supabase.
- Confirmation page shows real reference.
- Keep PDF download working with real data.

### Phase 3: Admin real data

Deliverables:
- Admin dashboard reads from Supabase.
- Remove `INITIAL_BOOKINGS` from runtime path.
- Approve/reject persists.
- Payment status/amounts read from database.
- Admin gate uses a login dialog popup and checks `kd_sutera_kasih_admin_users`.

### Phase 3.5: Venue media real data

Deliverables:
- Venue hero carousel reads from `kd_sutera_kasih_venue_media`.
- Venue gallery reads from `kd_sutera_kasih_venue_media`.
- Booking page video reads from the selected venue's `booking_video`.
- Keep local fallbacks while storage content is being migrated.
- Admin can add/change venue hero image, gallery images, and booking video without code changes.

### Phase 4: User booking history

Deliverables:
- Real `My Bookings` page at `/my-bookings`.
- Profile dropdown points to the new page.
- User can see their own submitted bookings.

### Phase 5: Enhancements

Deliverables:
- Search/filter/date range.
- Admin notes/reject reason.
- Admin venue create/edit UI.
- Layout snapshot storage.
- Calendar/conflict UI.

## Open Decisions Before Build

1. Booking submission requires login.
   - Decision: yes, users must be logged in before they can submit a booking.

2. Should pending bookings block overlapping submissions?
   - Recommended: only approved bookings hard-block. Pending overlaps should be visible to admin.

3. Payment status values.
   - Decision: use `not_paid`, `pending`, and `paid` only.
   - Recommended initial values: deposit starts `pending`, full payment starts `not_paid`.

4. Admin authorization.
   - Decision: use real app-specific admin role table `kd_sutera_kasih_admin_users`.
   - The admin login UX remains a simple dialog popup.

5. `My Bookings` page route.
   - Decision: use a separate user booking history page.
   - Current route proposal: `/my-bookings`.

6. Venue media storage.
   - Decision: use Supabase Storage for venue hero image, gallery images, and booking video media.
   - Booking receipts/files remain frontend-generated only and are not stored.

## Risk Notes

- Do not expose service-role keys in the browser.
- Do not trust client-submitted pricing. Always calculate pricing from `kd_sutera_kasih_venues`.
- Do not use the service role key for regular admin dashboard reads/writes.
- Do not trust frontend admin UI state for authorization.
- Admin authorization must come from `kd_sutera_kasih_admin_users` and RLS/RPC checks.
- Recheck booking conflicts inside the database/server before approval.
- Keep all project-owned objects prefixed because the database is shared.
