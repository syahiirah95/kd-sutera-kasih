# Web App Plan Index

This planning folder is intentionally modular.

Project planning requirements:
- all planning and app files must be modular
- hard limit: keep every file below 500 lines
- preferred target: keep every file below 300 lines when practical
- split by responsibility instead of growing large all-in-one files
- extract reusable logic, UI, constants, schemas, and data access into dedicated modules
- avoid pages or components that mix unrelated concerns

This same engineering rule should carry into the actual app codebase.

## Planning Modules
Read these files together as the full project plan:

1. `01-product-scope.md`
   Covers bounty alignment, product positioning, scope, pages, and venue content.

2. `02-booking-admin-flow.md`
   Covers booking flow, confirmation flow, validation, availability rules, and admin workflow.

3. `03-planner-data-tech.md`
   Covers the 2D/3D differentiator, layout data, data model, tech stack, and delivery phases.

4. `04-design-system-ui.md`
   Covers visual style, design tokens, `shadcn/ui` strategy, and component planning.

5. `05-security-owasp.md`
   Covers security requirements based on OWASP Top 10 and practical safeguards for this app.

6. `06-implementation-checklist.md`
   Covers the practical build order from setup to submission readiness.

## Core Product Summary
Build a responsive single-venue booking web app for weddings and other event types such as engagements, graduations, corporate events, and private functions.

The app must satisfy the bounty requirements:
- responsive landing page
- venue details page with key information
- booking request form
- custom date and time slot selection
- booking confirmation page
- admin login page
- admin dashboard to manage bookings
- booking statuses: pending, approved, rejected
- proper form validation
- clean and user-friendly overall experience

## Differentiator
The app will stand out through:
- 2D hall planner
- adaptive 3D venue preview
- setup item selection tied to the booking flow

## Confirmed Product Decisions
- backend and auth stack: Supabase
- MVP business model: single venue that supports multiple event types
- 3D preview behavior: available when the device and runtime performance can support it well
- future scalability: structure the data model and modules so multi-venue expansion remains possible later without rebuilding the architecture
- competition auth behavior: users must log in first, then can switch between `View as User` and `View as Admin` from the profile dropdown for judging and feature testing
- login methods: email/password and Google auth
- excluded auth method: no magic link flow
- account management: authenticated users should be able to update their password from the user account area
- account settings rule: password update should only appear for email/password accounts, while Google-auth users should see clear guidance that password management is handled by Google
- contextual help pattern: use a `?` icon in a circle for inline help, with short hover tooltip and click-to-open explanation modal

## Build Priorities
1. finish the core booking flow end to end
2. make the venue details page rich and decision-friendly
3. make validation and availability rules explicit
4. keep the admin flow complete and usable
5. add the 2D and 3D planner as a standout differentiator

## Modular Build Rule for Implementation
Apply these rules during development:
- keep route files thin
- move business logic into domain modules
- move schemas into dedicated validation files
- keep reusable UI in shared component folders
- isolate planner logic from booking form logic
- isolate admin logic from public-site logic
- prefer composition over huge components
- if a file approaches 300 lines, review whether it should be split
- treat security requirements as first-class implementation constraints
- follow the project OWASP-based security checklist during development

This index should stay short. Detailed planning belongs in the module files.
