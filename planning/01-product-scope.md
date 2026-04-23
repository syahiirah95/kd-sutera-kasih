# 01 Product Scope

## Project Overview
Build a responsive single-venue booking web app for an event space that supports weddings, engagements, graduations, corporate events, and private functions.

The app should feel practical, polished, and realistic for a real venue business. Users should be able to browse a venue, review important details, select a date and time slot, submit a booking request, and receive a clear confirmation. Admins should be able to log in, review incoming bookings, and manage booking statuses through a simple dashboard.

To differentiate this app from typical bounty submissions, the MVP will also include a lightweight 2D planner and synchronized 3D preview so users can visualize how the hall may look for their event setup.

## Bounty Alignment
This plan is designed to satisfy all stated bounty requirements:
- create a responsive landing page for the venue
- create a venue details page with key information
- include a booking request form
- allow users to select a date and time slot
- add a booking confirmation page
- create an admin login page
- create an admin dashboard to manage bookings
- support booking statuses: pending, approved, rejected
- add proper form validation
- make the overall experience clean and user-friendly

## Product Positioning
This is a single-venue booking app for one hall or venue, not a wedding-only app and not a multi-venue marketplace.

Wedding will be the main showcase scenario because it is visually strong and works well with a layout planner, but the booking flow should also support other event types such as:
- wedding reception
- engagement ceremony
- graduation event
- birthday party
- corporate function
- seminar or workshop
- private gathering

The system should therefore be flexible enough to support different event types while still feeling premium and realistic.

For the MVP, the venue catalog is intentionally simple:
- one active venue
- multiple supported event types
- one booking flow shared across event categories
- data structure kept scalable for future multi-venue expansion

For the competition build, authenticated testers should be able to explore both user and admin views after login so judges can review the full product without needing separate invite-based admin accounts.

## Main Goals
Build an MVP that lets users:
- browse the venue
- view important venue details
- choose an event type
- select a booking date and time slot
- fill in a booking request form
- review a booking summary
- submit a booking request
- receive a booking confirmation
- optionally customize a hall layout in 2D and preview it in 3D

Admins should be able to:
- log in securely
- review incoming bookings
- filter and inspect booking requests
- update booking status
- review submitted layout data if available

## Scope Definition
### Core Bounty MVP
These are the non-negotiable features that must be finished first:
- responsive landing page
- venue details page with key information
- booking request flow
- date and time slot selection
- booking summary and confirmation page
- admin login page
- admin dashboard
- booking status management
- proper form validation
- clean responsive user experience

### Differentiator MVP
These features are intentionally included to stand out from other entries:
- 2D hall planner
- synchronized 3D venue preview
- item selection for event setup
- saved layout snapshot or JSON attached to the booking

### Out of Scope
To keep the bounty deliverable realistic, do not include:
- payment integration
- full quotation and invoicing system
- multi-venue marketplace features in the MVP
- complex staff management
- advanced analytics

## Key Pages
### Public Pages
- landing page
- login page
- user account page
- venue details page
- booking form page or multi-step flow
- booking review page
- booking confirmation page

### Admin Pages
- admin login page
- admin dashboard
- booking list page or main dashboard table
- booking details page

## Landing Page Requirements
The landing page should:
- clearly present the venue brand and value proposition
- highlight the venue for multiple event types
- show key selling points such as capacity, facilities, and flexible setup
- include strong call-to-action buttons for viewing details or starting a booking
- be fully responsive on mobile, tablet, and desktop

Suggested sections:
- hero section
- venue highlights
- event types supported
- gallery preview
- facilities summary
- booking call-to-action

## Venue Details Page Requirements
The venue details page should explicitly include key information required for decision-making:
- venue name
- short description
- photo gallery
- venue capacity
- available event types
- facilities and amenities
- location or address
- operating hours
- available time slots with exact start and end time
- booking notes or policies
- contact or inquiry info

Optional but useful:
- sample layouts
- event inspiration gallery
- FAQ section

## Key MVP Principles
- satisfy the core bounty requirements first
- keep the booking flow easy to understand
- make responsiveness and usability part of the MVP, not an afterthought
- use 2D and 3D as a clear differentiator, not as a replacement for core flow quality
- keep the feature set realistic enough to finish well
- prioritize polished execution over too many advanced extras

## Final Build Recommendation
For the first deliverable:
- complete the full booking flow end to end
- make venue details rich and decision-friendly
- define validation and availability clearly
- ensure the admin flow is complete and usable
- keep the app responsive and polished on all main screen sizes
- include the 2D planner and 3D preview as a standout differentiator

This approach gives the project a strong chance of meeting the bounty requirements while still standing out from more basic submissions.
