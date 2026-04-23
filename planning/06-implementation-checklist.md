# 06 Implementation Checklist

## Purpose
This checklist translates the planning modules into a practical build order.

Use this file as the working implementation reference for:
- feature sequencing
- architecture discipline
- UI consistency
- security checks
- demo-readiness for the competition

## Build Rules Before Coding
- keep every file below 500 lines
- target below 300 lines whenever practical
- split components, schemas, services, and helpers by responsibility
- avoid large page files with mixed UI and business logic
- follow the OWASP-based security module during implementation
- keep the competition demo-role behavior isolated from core auth logic

## Phase 0: Project Setup
### Foundation Setup
- initialize Next.js app structure
- configure Tailwind CSS
- install and configure `shadcn/ui`
- set up folder structure for `app`, `components`, and `lib`
- create shared design tokens and theme variables
- set up ESLint, formatting, and consistent import conventions

### Core Dependencies
- add Supabase client libraries
- add React Hook Form
- add Zod
- add planner dependencies such as Konva.js
- add 3D dependencies such as React Three Fiber and Three.js

### Environment Setup
- define required environment variables
- separate public env vars from server-only secrets
- document local setup steps
- confirm no secrets are committed

## Phase 1: App Architecture And Shared Modules
### Routing And Layouts
- create public route group
- create admin route group
- create login route
- create account/settings route
- create shared app shell and navigation structure

### Shared Modules
- create `lib/auth`
- create `lib/validation`
- create `lib/data`
- create `lib/constants`
- create `lib/types`
- create `lib/demo-mode`
- create `components/shared`
- create `components/help`

### Shared UI Patterns
- build section header pattern
- build status badge pattern
- build summary row pattern
- build empty state pattern
- build error state pattern
- build loading skeleton pattern
- build contextual help trigger pattern

## Phase 2: Authentication And Session Flow
### Supabase Auth
- configure Supabase project and auth settings
- enable email/password auth
- enable Google auth
- confirm magic link is disabled or not used

### Login Experience
- build login page UI
- support email/password sign in
- support Google sign in
- add loading and error states
- handle authenticated redirect flow

### Session Handling
- create server-side session helpers
- protect account pages
- protect admin routes
- add logout flow
- expose authenticated user info to shared header/profile UI

### Account Settings
- build account/settings page
- show account identity information
- show password update form for email/password users
- hide or disable password update for Google-auth users
- show explanation for Google-managed credentials
- add success and error feedback for password update

## Phase 3: Demo Role Switching
### Competition Demo Mode
- implement authenticated `View as User` and `View as Admin` switching
- place role switcher in profile dropdown
- show current active mode in the UI
- default to `User` mode after login
- keep this behavior isolated as demo-only logic

### Guardrails
- ensure unauthenticated users cannot switch modes
- make demo-mode behavior easy to remove later
- use only demo-safe data assumptions
- document clearly that this is competition-only behavior

## Phase 4: Public Marketing And Venue Pages
### Landing Page
- build hero section
- build event-type highlights
- build venue highlights
- build facilities summary
- build gallery preview
- add strong CTA buttons
- apply dreamy premium visual style

### Venue Details Page
- show venue name and description
- show gallery
- show capacity and facilities
- show policies and notes
- show exact custom time slot examples or availability view
- add booking CTA
- add contextual help where useful

## Phase 5: Booking Flow
### Booking Form Structure
- build multi-step booking flow
- implement event basics step
- implement contact details step
- implement event notes step
- implement review and submit step

### Validation
- create Zod schemas for all booking steps
- validate on client for UX
- validate again on server for security
- block invalid submissions
- show inline field errors

### Booking Availability
- model exact time slots
- display available and unavailable slots clearly
- revalidate slot availability before final submit
- handle slot-conflict error state cleanly

### Booking Confirmation
- build confirmation page
- show booking reference
- show selected slot and event details
- show pending status
- show next-step messaging

## Phase 6: Admin Dashboard
### Admin Experience
- build admin dashboard shell
- build booking table or list view
- add filters by status
- add booking detail view
- show layout summary when available
- add approve and reject actions

### Admin Rules
- validate status changes server-side
- record booking status history
- log who changed status and when
- show clear status badges
- add contextual help for admin actions

## Phase 7: 2D Planner
### Core Planner
- build 2D hall canvas
- create item library panel
- add place, move, rotate, duplicate, and delete actions
- add grid or snapping behavior
- keep placements within hall bounds
- add basic overlap guidance

### Planner Data
- serialize layout state
- store layout data with booking
- support loading saved layout state
- validate planner payload shape before persistence

### Planner Help
- add contextual help for planner controls
- explain move, rotate, duplicate, and delete interactions

## Phase 8: Adaptive 3D Preview
### 3D Integration
- lazy-load 3D preview
- sync 2D layout data into 3D scene
- render hall shell and setup items
- allow orbit, pan, and zoom

### Adaptive Behavior
- detect when device/runtime can support 3D well enough
- enable 3D on capable devices
- fall back gracefully on weak devices
- allow booking flow to continue without 3D

### Fallback Options
- 2D-only mode
- static preview image
- simplified low-detail 3D scene

## Phase 9: Contextual Help System
### Help Pattern
- build reusable circular `?` help trigger
- show short tooltip on hover
- show explanation modal on click
- keep help copy concise and specific

### Coverage
- booking fields and time slots
- planner tools
- booking statuses
- admin actions
- profile dropdown mode switching
- account settings and password rules

## Phase 10: Security Implementation
### OWASP-Aligned Work
- validate every input on the server
- protect admin routes server-side
- centralize auth and authorization logic
- use safe query patterns
- review Supabase row-level security or equivalent protections
- keep sensitive secrets out of the client

### Abuse And Integrity Checks
- add rate limiting where practical
- recheck booking slot conflicts at write time
- ensure booking status changes are authorized
- log auth and booking-management events safely

## Phase 11: QA And Final Review
### Functional QA
- test email/password login
- test Google login
- test logout
- test password update for email/password users
- test Google-auth account settings behavior
- test role switching between `User` and `Admin`
- test booking flow end to end
- test admin approve and reject flow
- test planner save and reload flow
- test 3D fallback behavior

### UX QA
- test mobile, tablet, and desktop layouts
- verify component sizing consistency
- verify tooltip and modal help behavior
- verify loading, empty, error, and success states
- verify admin dashboard readability

### Security QA
- verify protected admin routes
- verify unauthenticated redirect behavior
- verify server-side validation
- verify slot conflict protection
- verify secrets and env setup

## Submission Readiness Checklist
- core bounty requirements are complete
- single-venue, multiple-event positioning is clear
- demo role-switch flow works after login
- 2D planner works reliably
- 3D preview works on capable devices
- fallback behavior works on weak devices
- account settings behavior is correct for both auth methods
- contextual help is available in key places
- security basics are in place
- UI feels polished and cohesive
