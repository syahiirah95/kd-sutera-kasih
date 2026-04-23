# 02 Booking And Admin Flow

## Booking Flow
### Recommended User Flow
1. User opens the landing page
2. User signs in
3. User visits the venue details page
4. User reviews venue information and available time slots
5. User starts a booking request
6. User selects event type, date, and time slot
7. User fills in event and contact details
8. User optionally customizes the hall in the 2D planner and reviews the 3D preview
9. User reviews a booking summary
10. User submits the booking request
11. User lands on a booking confirmation page with reference details and next-step messaging

## Authentication And Role View Flow
For the competition build:
- users must log in before accessing booking actions
- after login, the profile dropdown should show `View as User` and `View as Admin`
- the toggle should let judges explore both public booking flow and admin dashboard from one account
- the current active view mode should be clearly indicated in the UI
- switching modes should feel immediate and should not require creating separate accounts

### Profile Dropdown Requirements
- show user email or display name
- include current active view label
- include `View as User` action
- include `View as Admin` action
- include account settings action
- include logout action

### Demo Role Toggle Rules
- default view after login should be `User`
- switching to `Admin` should open or enable the admin dashboard experience
- switching back to `User` should return to the public booking experience
- role switching should be available only after authentication
- demo role switching is intended for judging and product evaluation

## Login And Account Requirements
### Login Methods
- email and password login
- Google auth login
- no magic link flow

### Account Management
- authenticated users should have an account area or settings page
- users should be able to update their password
- password update should only be shown for email/password accounts
- Google-auth users should see a short explanation that password changes are managed through Google
- password update flow should confirm the current intent clearly
- successful password change should show confirmation feedback

## Contextual Help Requirements
To make the app easier to understand for first-time users and judges:
- key flows should include inline contextual help
- use a `?` icon inside a small circle as the standard help trigger
- hovering the help trigger should show a short tooltip
- clicking the help trigger should open a modal with a slightly fuller explanation
- help content should be concise, practical, and specific to the nearby feature

### Recommended Help Coverage
- booking date and time slot selection
- planner controls such as move, rotate, duplicate, and delete
- booking status meanings such as pending, approved, and rejected
- admin actions such as approve or reject
- account settings and password update behavior
- role-view switching between `User` and `Admin`

## Booking Form Structure
### Step 1: Event Basics
- event type
- event date
- time slot
- estimated guest count

### Step 2: Contact Details
- full name
- email
- phone number
- organization name if applicable

### Step 3: Event Notes
- special requests
- setup notes
- preferred theme or style

### Step 4: Layout Planning
- choose setup items
- place items in 2D
- preview arrangement in 3D

### Step 5: Review And Submit
- venue summary
- selected slot
- event details
- contact details
- layout preview or summary
- final notes

## Booking Confirmation Page
The confirmation page should not be just a success message. It should include:
- booking submitted state
- booking reference number
- selected venue
- event date and time slot
- submitted contact name
- current status shown as pending
- next steps for admin review
- option to return to home or venue page

This page helps satisfy the bounty requirement and gives the flow a complete finish.

## Validation Rules
Proper form validation must be explicit in the plan.

### Required Validation
- all required contact fields must be filled
- email must be valid
- phone number must be valid enough for contact use
- event date cannot be in the past
- time slot must be selected
- guest count must be within allowed range
- event type must be selected

### Availability Validation
- selected slot must still be available before final submission
- conflicting approved bookings must block submission
- conflicting pending bookings should either block temporarily or be clearly marked for admin review, depending on chosen business rule

### Planner Validation
- required setup items should not exceed allowed quantity
- objects should stay within the venue bounds
- placements should respect simple collision or zone rules where applicable

### UX Error Handling
- inline field errors
- disabled submit when form is invalid
- clear server-side error message on failure
- loading state during submission
- empty state when no slots are available

## Booking Availability Rules
This part needs to be defined clearly so the booking flow feels realistic.

### Time Slot Model
Use explicit custom time slots instead of vague session labels so the booking flow feels detailed and realistic.

Example fixed custom slots:
- 10:00 AM to 2:00 PM
- 3:00 PM to 7:00 PM
- 8:00 PM to 11:00 PM

The UI should always show the actual start and end time for each slot.

### Booking Rules
- users can only book available future slots
- approved bookings lock the selected slot
- admin can manually reject or approve pending bookings
- unavailable slots must be visibly disabled in the UI
- if a slot becomes unavailable before submit, the user must be prompted to choose another slot

### Admin Controls
- view bookings by date
- view bookings by status
- optionally block a date or slot for maintenance or private hold

### Time Slot UX Recommendation
- present slots as clear selectable cards or buttons
- show exact start and end time
- disable unavailable slots visually
- show selected slot clearly in the booking summary
- revalidate the chosen slot before final submission

## Admin Workflow
### Admin Can
- log in securely
- access protected admin routes
- view a list of incoming bookings
- see booking summary fields directly in the table
- filter bookings by status
- open a booking detail view
- review event details and submitted notes
- review layout summary if the planner was used
- change booking status to pending, approved, or rejected

### Recommended Dashboard Table Fields
- booking reference
- customer name
- event type
- booking date
- time slot
- guest count
- status
- created at

### Booking Statuses
- pending
- approved
- rejected

## UX Quality Requirements
Because the bounty explicitly values a clean and user-friendly experience, the app should include:
- mobile-first responsive layouts
- readable typography and spacing
- clear CTA hierarchy
- keyboard-accessible forms
- accessible labels and validation messages
- loading states
- empty states
- error states
- success states
- clear navigation between booking steps

### Responsive Targets
- mobile phone
- tablet
- desktop

### UX Expectations
- booking flow should be understandable without explanation
- users should always know what step they are on
- forms should feel short and manageable even if multi-step
- admin dashboard should prioritize speed and clarity over visual complexity
