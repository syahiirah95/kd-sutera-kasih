# 05 Security And OWASP Requirements

## Security Requirement
Security is part of the project requirements.

This web app should be implemented with practical safeguards aligned to the `OWASP Top 10`, especially because it includes:
- public booking submission
- admin authentication
- booking management actions
- user-provided form input
- protected admin routes

The goal is not enterprise-grade complexity, but strong secure-by-default behavior for an MVP.

## Competition Demo Exception
For this competition build, users must authenticate first, but after login they may switch between `View as User` and `View as Admin` from the profile dropdown so judges can test the full app easily.

This is a deliberate demo-mode exception and must be documented honestly:
- it is acceptable for evaluation convenience in the competition build
- it is not the same as production-grade admin authorization
- it should only be used with non-sensitive demo data
- it should be isolated so it can be removed or replaced for a real deployment

## Core Security Principles
- validate all input on both client and server
- never trust client-side state for authorization or booking status changes
- keep authentication and authorization logic centralized
- use least privilege for admin access and backend credentials
- sanitize and encode data where appropriate
- log important security-relevant events without leaking sensitive data
- prefer secure defaults in framework, database, and deployment config

## OWASP Top 10 Mapping

### A01 Broken Access Control
Requirements:
- admin routes must be protected server-side, not only hidden in the UI
- only authenticated admins can access booking management actions
- only authorized admins can approve, reject, or modify bookings
- direct object access must be checked on the server for every booking detail request
- never expose admin-only data in public responses

Implementation notes:
- enforce route protection in middleware or server-side guards
- verify session and role before every admin action
- scope queries to intended data access paths

Competition build note:
- if authenticated users are allowed to switch into admin view for judging, this must be treated as a demo-only authorization model
- do not present it as production-safe access control

### A02 Cryptographic Failures
Requirements:
- use HTTPS in deployment
- never store plain-text passwords
- use trusted password hashing through the auth provider or modern secure hashing
- store secrets only in environment variables or deployment secret storage
- never commit secrets, tokens, or service-role keys into the repository
- minimize stored personal data to only what the booking flow needs

Implementation notes:
- use secure cookie settings if cookie-based auth is used
- encrypt sensitive values in transit and rely on platform-supported secure storage for secrets

### A03 Injection
Requirements:
- validate and sanitize all incoming data
- use parameterized queries or ORM-safe query builders
- never build SQL strings from raw user input
- guard against command injection by avoiding shell execution from user-controlled values
- validate planner payload structure before saving layout JSON

Implementation notes:
- use `Zod` schemas for request validation
- reject malformed layout data early

### A04 Insecure Design
Requirements:
- define booking availability rules clearly before implementation
- enforce booking status transitions with server-side rules
- protect against double booking through slot revalidation during submission
- keep risky actions explicit, such as approve and reject
- design admin actions to be auditable

Implementation notes:
- model security rules at the domain level, not only in UI components
- use confirmation patterns for destructive or high-impact admin actions

### A05 Security Misconfiguration
Requirements:
- disable debug exposure in production
- use secure HTTP headers
- configure authentication redirects safely
- restrict CORS to intended origins only
- keep database and storage policies explicit
- remove unused endpoints, test accounts, and placeholder secrets before deployment

Implementation notes:
- review framework production settings before shipping
- define Supabase row-level security and route-level protection intentionally

### A06 Vulnerable And Outdated Components
Requirements:
- keep framework and dependencies reasonably up to date
- avoid abandoned packages for auth, forms, planner logic, or admin tooling
- review package necessity before adding new dependencies
- run dependency audit checks before submission or deployment

Implementation notes:
- prefer well-maintained ecosystem tools already planned for the stack
- reduce dependency sprawl where possible

### A07 Identification And Authentication Failures
Requirements:
- require authentication for all admin routes and actions
- use strong password rules if self-managed auth is ever added
- protect login flow against brute force with rate limiting or provider safeguards
- expire or rotate sessions appropriately
- ensure logout properly clears the active session

Implementation notes:
- use Supabase Auth instead of building custom auth from scratch
- support email/password and Google auth
- do not rely on magic link for this build
- add rate limiting to admin login and sensitive actions where possible

### A08 Software And Data Integrity Failures
Requirements:
- validate trusted sources for third-party assets and packages
- do not trust client-submitted booking status or pricing-related values
- server must derive protected fields independently
- lock down CI, deployment, and environment configuration changes

Implementation notes:
- booking status should only be changeable through protected admin actions
- planner data and booking summaries should be server-validated before persistence

### A09 Security Logging And Monitoring Failures
Requirements:
- log admin login attempts, booking submissions, and booking status changes
- log validation and authorization failures where useful
- do not log raw passwords, secrets, or unnecessary personal data
- keep logs useful enough to trace suspicious or broken behavior

Implementation notes:
- create simple audit trails for status changes and admin actions
- include timestamps and actor identifiers for admin booking decisions

### A10 Server-Side Request Forgery
Requirements:
- avoid server-side fetching of arbitrary user-provided URLs
- if external media or integrations are ever added, whitelist trusted domains
- do not proxy unknown user-controlled destinations through backend routes

Implementation notes:
- current MVP should avoid unnecessary server-side URL fetching from user input

## App-Specific Security Checklist

### Public Booking Flow
- validate all booking fields server-side
- recheck slot availability at submission time
- rate limit booking submission if abuse becomes possible
- show safe error messages without exposing internals

### Admin Authentication
- use Supabase Auth for admin authentication
- protect admin pages on the server
- restrict admin actions to authenticated admin users only
- add login throttling or rate limiting where practical

Competition build note:
- authenticated users may be allowed to toggle into admin view after login for judging
- this behavior should be guarded by a demo-mode flag or clearly isolated build rule
- use only demo-safe seeded data when this mode is enabled

### Admin Dashboard
- protect booking detail endpoints from unauthorized access
- record who changed a booking status and when
- require valid status values only
- avoid mass-update actions unless authorization is fully controlled

### Input And File Handling
- validate contact fields, notes, and planner payloads
- limit payload size for planner JSON and notes fields
- if file uploads are added later, validate type, size, and storage rules strictly

### Secrets And Environment
- separate public env vars from server-only secrets
- never expose service-role credentials to the client
- document required env vars clearly for safe setup

### Password Management
- use Supabase-supported secure password handling
- allow authenticated users to update their password from the account area
- show password update only for email/password accounts
- for Google-auth users, show guidance that credential changes are managed by Google
- require server-side validation for password update inputs
- show safe success and error feedback without leaking sensitive auth details

## Recommended Security Implementation For This Stack
- use `Zod` for server-side request validation
- use framework-safe server actions, route handlers, or API layers with explicit validation
- use Supabase Auth for admin login and session handling
- use Supabase row-level security or equivalent backend authorization checks for admin data
- use safe query patterns and avoid raw unchecked SQL
- add middleware or server guards for protected admin areas
- centralize auth, validation, and authorization helpers in dedicated modules

## Secure Modular Architecture Requirement
To stay maintainable and secure:
- keep auth logic in dedicated auth modules
- keep authorization checks in reusable guard utilities
- keep validation schemas in dedicated files
- keep database access in service or repository modules
- keep audit logging in a dedicated helper or service
- do not scatter security-critical logic across large page files

## Minimum Security Bar Before Submission
- login is protected
- admin routes are server-guarded
- booking form is validated server-side
- slot conflicts are revalidated on submit
- booking status changes are authorized
- secrets are not exposed
- production config is reviewed
- dependency audit is checked

Security should be treated as part of the MVP quality bar, not as optional polish.
