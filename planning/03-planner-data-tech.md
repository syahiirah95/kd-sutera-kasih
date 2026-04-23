# 03 Planner, Data, And Tech

## 2D Planner Differentiator
The 2D planner is part of the MVP because it is the main feature that differentiates this entry from standard booking apps.

### 2D Planner Responsibilities
- top-down hall view
- drag and drop objects
- move, rotate, duplicate, and delete objects
- snap to grid
- keep placements within hall boundaries
- basic collision or overlap warnings
- save layout state to booking data

### Why 2D Leads The Editing Flow
- easier to control on desktop and tablet
- faster to build than a full 3D editor
- more practical for actual layout adjustments
- simpler to validate and save

## 3D Preview Differentiator
The 3D preview should strengthen the wow factor without becoming the main blocker for delivery.

### 3D Preview Responsibilities
- render the hall shell
- display placed items from the 2D planner
- reflect live layout changes
- allow orbit, pan, and zoom
- provide a realistic preview for user confidence

### MVP Guardrail
Do not turn the 3D experience into a full advanced editor for the bounty.
The editing logic should stay centered in the booking flow and 2D planner, while 3D remains a synchronized visualization layer.

### Adaptive 3D Availability
The 3D preview should be enabled only when the device and runtime performance can support it well.

Recommended behavior:
- default to full 2D planner support on all supported devices
- enable 3D preview on capable desktop and tablet devices
- lazy-load 3D assets instead of blocking the booking flow
- provide a graceful fallback when performance is weak
- allow the booking flow to continue even if 3D preview is unavailable

Possible fallback options:
- 2D-only planning mode
- static preview image
- simplified low-detail 3D scene

## Layout And Setup Data
### Layout Capabilities
- object placement by coordinate
- rotation per object
- quantity tracking
- zone-aware placement
- save and load layout state

### Example Setup Objects
- stage platform
- round table
- rectangular table
- chair
- VIP sofa
- aisle carpet
- floral stand
- welcome sign
- registration table
- cake table
- photo booth frame

### Layout Data Per Object
- object id
- asset type
- position x, y, z
- rotation
- scale if needed
- category
- variant or theme style if used

## Data Model Overview
The MVP should be implemented as a single-venue system, while still keeping the schema extensible enough for future multi-venue support.

### Main Entities
- venues
- venue_images
- venue_time_slots
- bookings
- booking_status_history
- booking_contacts
- booking_layouts
- booking_layout_objects
- admin_users

### Booking Fields
- booking reference
- venue id
- event type
- event date
- time slot id or slot label
- guest count
- contact name
- email
- phone
- notes
- status
- submitted at

## Suggested Tech Stack
### Frontend
- Next.js / React
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod

### 2D Planner
- Konva.js

### 3D Scene
- React Three Fiber
- Three.js
- GLTF / GLB assets

### Backend
- Supabase

### Auth
- Supabase Auth for admin authentication
- Supabase email/password auth
- Supabase Google OAuth
- no magic link authentication

### Competition Auth Model
- use Supabase Auth for authenticated users
- allow one authenticated account type for the competition build
- store or derive a view-mode state such as `user` or `admin` after login
- allow authenticated users to switch UI mode from the profile dropdown
- keep this role-switch behavior isolated as a competition/demo feature, not a production default

### Database Strategy
- use a single seeded venue record for the MVP
- keep `venue_id` in related tables so future multi-venue support remains possible
- define slot availability and booking conflict checks at the database and service layer

### Booking Conflict Protection
Because this app uses exact custom time slots, booking protection should be explicit:
- the server must recheck slot availability immediately before creating a booking
- approved bookings should hard-lock the selected `venue_id + event_date + time_slot`
- pending bookings should remain visible to admins for review without bypassing conflict checks
- admin approval must fail safely if another booking has already locked the slot
- use a Supabase-safe database transaction or RPC flow for final availability confirmation and write

### Storage
- saved booking data
- saved layout JSON
- image assets
- 3D asset files

## Engineering Standards
These implementation constraints are part of the project requirements:
- all files must stay below 500 lines
- target below 300 lines whenever practical
- split features into small modules by responsibility
- keep route files focused on composition, not heavy logic
- extract schema validation into dedicated files
- extract data fetching and database calls into service modules
- extract reusable UI into shared components
- extract constants, types, and config into separate modules
- isolate public-site modules from admin modules
- isolate planner modules from booking-form modules

### Suggested Codebase Structure
- `app/(public)` for landing, venue, booking, confirmation
- `app/login` for authentication entry
- `app/account` for user account settings such as password update
- `app/(admin)` for admin login and dashboard routes
- `components/ui` for shadcn-generated primitives
- `components/shared` for reusable app components
- `components/marketing` for landing and public presentation sections
- `components/booking` for booking flow UI
- `components/admin` for dashboard and booking management UI
- `components/planner-2d` for editor-specific UI
- `components/planner-3d` for preview-specific UI
- `components/help` for tooltip-trigger and explanation modal patterns
- `lib/validation` for zod schemas
- `lib/data` for queries and mutations
- `lib/constants` for slot config, statuses, event types, and labels
- `lib/types` for shared types
- `lib/auth` for Supabase auth helpers and session utilities
- `lib/demo-mode` for authenticated role-view switching logic if separated from auth helpers

## Delivery Phases
### Phase 1: Core Bounty Flow
- landing page
- venue details page
- booking form
- date and time slot selection
- validation rules
- booking summary
- booking confirmation page
- admin login
- admin dashboard
- status management

### Phase 2: Availability And Admin Quality
- slot availability logic
- protected admin routes
- booking detail page
- status filters
- empty and error states

### Phase 3: Differentiator Experience
- 2D planner
- setup item library
- saved layout state
- synchronized 3D preview

### Phase 4: Polish
- visual refinement
- responsive tuning
- accessibility pass
- performance optimization for planner and 3D assets
