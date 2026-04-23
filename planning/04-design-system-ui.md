# 04 Design System And UI

## Visual Style Direction
The web app should follow a soft, dreamy, high-polish visual style inspired by the reference image, but adapted for a real venue booking product.

### Style Goals
- whimsical but still practical
- premium and polished
- warm and welcoming
- visually immersive
- modern and clean

### Visual Characteristics
- soft cream, champagne, peach, warm beige, and muted gold tones
- frosted glass or translucent panels for hero navigation and cards
- rounded UI surfaces with soft shadows
- subtle glow lighting on key sections and call-to-action areas
- layered hero composition with elegant imagery or 3D-inspired visuals
- premium typography pairing with clear readable body text

### Practical Product Adaptation
Even with a dreamy visual direction, the app should still feel usable for real booking tasks:
- strong contrast for important labels and buttons
- clear form hierarchy
- readable inputs and validation states
- simplified dashboard styling for admin usability
- planner UI should prioritize clarity over decoration
- contextual help should be easy to spot without visually cluttering the interface

### Landing Page Style Outline
- cinematic hero section with dreamy venue imagery
- floating glassmorphism navigation bar
- bold headline with premium event-booking messaging
- warm gradient lighting and soft background blur
- elegant CTA buttons using layered shadows and rounded shapes
- gallery and feature sections with polished card layouts

### Public Page Styling Approach
- landing page can be the most expressive and atmospheric
- venue details page should balance beauty with information clarity
- booking form pages should be cleaner and more task-focused
- confirmation page should feel celebratory but still informative

### Admin Styling Approach
- keep admin UI simpler than the public marketing pages
- still use the same design system for consistency
- prioritize tables, filters, status badges, and readability

## Design System Outline
The UI should be built with `shadcn/ui` as the main component foundation, then customized to match the dreamy premium visual direction.

### Design Tokens
These tokens should guide the first implementation pass.

#### Color Direction
- background: soft ivory or warm off-white
- surface: translucent white, cream, or light champagne
- primary: muted gold or warm peach
- secondary: dusty beige or soft rose
- accent: warm amber glow
- text primary: deep brown or charcoal
- text secondary: muted taupe or gray-brown
- border: soft white with low-opacity gold or beige tint
- success: soft green
- warning: warm amber
- destructive: muted rose red

#### Surface Style
- large rounded corners for hero cards and feature sections
- medium rounded corners for forms, dialogs, and booking cards
- soft layered shadows instead of harsh dark shadows
- translucent glass panels for selected public-facing sections
- subtle gradient backgrounds instead of flat solid fills

#### Typography Direction
- headline font: elegant serif or soft-display font with premium feel
- body font: clean readable sans-serif
- large expressive hero headlines
- concise readable supporting text
- stronger weight for labels, booking values, and section headings

#### Motion Direction
- soft fade and slide-in transitions on section load
- gentle hover lift on cards and buttons
- subtle glow emphasis on primary CTA buttons
- smooth tab and step transitions in the booking flow

#### Sizing And Spacing Direction
- use a consistent spacing scale based on 4px increments
- prefer comfortable vertical rhythm over overly tight layouts
- use larger spacing for marketing sections and tighter spacing for dense admin data
- keep component heights predictable across forms and dashboards
- avoid oversized decorative elements that hurt readability or responsiveness

### Layout Sizing Best Practices
These sizing rules should be treated as implementation guidance across the app.

#### Container Widths
- mobile content width: full width with safe side padding
- tablet content width: centered with moderate horizontal padding
- desktop page container: around 1200px to 1280px max width
- wide hero sections can visually stretch beyond the main content container, but text content should remain constrained for readability

#### Section Spacing
- mobile section spacing: around 48px to 64px vertically
- tablet section spacing: around 64px to 80px vertically
- desktop section spacing: around 80px to 112px vertically
- card internal padding should scale down slightly on mobile and open up on desktop

#### Grid Guidance
- use 1 column on small mobile for dense content
- use 2 columns on tablet where readability remains strong
- use 3 to 4 columns on desktop for highlights, facilities, or gallery blocks
- avoid forcing equal-height layouts if content becomes cramped or awkward

#### Typography Sizing Guidance
- hero headline: large and expressive, but wrap cleanly across responsive breakpoints
- section headline: clearly smaller than hero but still prominent
- body text: keep around readable paragraph sizing, avoid tiny marketing text
- labels and helper text: smaller than body text but still comfortably legible

#### Radius Guidance
- hero cards and major feature surfaces: large radius
- forms, booking cards, dialogs: medium radius
- dense utility controls and badges: smaller radius
- keep radius values consistent so the UI feels intentional, not random

### Component Sizing Best Practices
These guidelines help keep the app polished and consistent.

#### Buttons
- default button height should feel comfortable for both mouse and touch
- large CTA buttons should be reserved for hero and important booking actions
- icon-only buttons must still preserve accessible hit area
- avoid mixing too many button heights on the same page

Recommended pattern:
- small: compact utility actions
- default: standard forms and dashboard actions
- large: primary landing page and booking CTAs

#### Inputs And Selects
- text inputs, selects, and date controls should share the same default height
- use full-width fields in mobile layouts
- for desktop, split fields into columns only when the form still reads naturally
- textareas should have comfortable minimum height for notes without dominating the page

#### Cards
- marketing cards should have generous padding and visual breathing room
- booking summary cards should prioritize hierarchy and readability
- admin cards should be slightly denser than marketing cards
- slot cards should be big enough to clearly show time range and state without wrapping awkwardly

#### Dialogs And Sheets
- small dialogs for confirmations or short detail blocks
- medium dialogs for booking detail review
- side sheets for filters, planner tools, or mobile side panels
- avoid over-wide dialogs that reduce scanability

#### Tables
- keep row height readable and not overly compressed
- on smaller screens, switch dense tables to stacked cards or simplified rows
- do not force full desktop table layouts on mobile

#### Badges And Status Indicators
- badges should stay compact, but not so small that status becomes hard to scan
- use consistent padding and font size across `pending`, `approved`, and `rejected`
- avoid oversized decorative badges that compete with primary content

#### Help Triggers
- help icons should be compact but still easy to target
- use a circular outline or soft-filled treatment for the `?` icon
- preserve enough hit area for mouse and touch use
- tooltip content should stay short and scannable
- explanation modals should be medium width and easy to read

#### Planner Panels
- left or right side panels should have fixed practical widths on desktop
- toolbars should remain compact and scannable
- the canvas area should always get the highest layout priority
- on smaller screens, move controls into tabs, sheets, or collapsible panels

### Responsive Component Rules
- size for touch on mobile first
- reduce decorative padding before reducing text legibility
- stack content before shrinking controls too aggressively
- maintain consistent spacing rhythm between sections, cards, and form groups
- if a component becomes too dense on mobile, switch the layout pattern instead of forcing a smaller size

### Best-Practice Constraint
Do not rely on ad hoc per-page sizing.
Define reusable size tokens and apply them consistently across shared components so the public pages, booking flow, admin UI, and planner feel like one system.

### shadcn/ui Customization Strategy
- use shadcn/ui as the base for consistency and speed
- customize theme variables to match the dreamy venue aesthetic
- keep public pages more expressive with gradients, blur, and glow
- keep admin pages cleaner, flatter, and more functional
- avoid over-styling form controls if it reduces readability or accessibility

## Component Planning With shadcn/ui
This section outlines the main component usage so the UI direction is easier to implement.

### Landing Page Components
- `Button` for primary and secondary CTA actions
- `Card` for venue highlights, facilities, and featured event types
- `Navigation Menu` or custom nav built with shadcn primitives
- `Carousel` pattern for gallery or featured venue imagery if needed
- `Badge` for capacity, premium features, and supported event labels
- `Separator` for clean section transitions
- `Dialog` for quick inquiry or preview actions if needed

### Venue Details Page Components
- `Card` for venue information blocks
- `Tabs` for overview, facilities, policies, and gallery sections
- `Badge` for event types and facilities
- `Accordion` for FAQ or policies
- `Button` for booking CTA
- `Aspect Ratio` for gallery imagery or preview frames

### Booking Flow Components
- `Form` for structured field integration with React Hook Form
- `Input` for name, email, phone, and guest count
- `Textarea` for special requests and notes
- `Select` for event type where appropriate
- `Calendar` or date picker pattern for event date
- `Button` for step navigation and submission
- `Card` for booking summary and slot options
- `Badge` for selected state and status cues
- `Progress` or custom step indicator for multi-step flow
- `Alert` for validation or availability warnings

### Authentication And Profile Components
- `Form` for login flow
- `Input` for email and password fields
- `Button` for sign in and sign out actions
- `Dropdown Menu` for profile actions
- `Avatar` for user identity display if desired
- `Badge` for current active view mode such as `User` or `Admin`
- `Card` for account settings and password update form
- `Alert` for password update success and error feedback
- provider login button for Google auth

Password-management UI rule:
- show `Change Password` only for email/password accounts
- for Google-auth accounts, show a concise info state explaining that password changes are managed through Google

### Time Slot Picker Components
- `Toggle Group` or selectable `Card` pattern for fixed custom slots
- `Badge` for available, selected, and unavailable states
- `Tooltip` for extra slot notes if needed
- `Alert` for slot conflict or revalidation failure

The time slot picker should feel detailed and premium:
- each slot card should show exact start time and end time
- each slot card can also show slot status such as available or unavailable
- selected slot should be highlighted clearly with stronger border and background treatment

### Booking Confirmation Components
- `Card` for submitted booking summary
- `Badge` for current status shown as pending
- `Button` for return actions
- `Separator` for clean information grouping

### Admin Dashboard Components
- `Card` for dashboard stats or summary panels
- `Table` or data table pattern for booking management
- `Badge` for booking statuses
- `Input` for search
- `Select` for status filters
- `Tabs` for different dashboard views if needed
- `Dialog` or dedicated page for booking detail review
- `Button` for approve and reject actions
- `Textarea` for internal notes if included

### Planner UI Components
- `Card` for item library, object list, and planner controls
- `Tabs` for switching between setup categories
- `Button` for rotate, duplicate, delete, and reset actions
- `Slider` for simple adjustments if needed
- `Badge` for object count or active selection state
- `Sheet` or side panel for planner controls on smaller screens

### Contextual Help Components
- `Tooltip` for short hover explanations
- `Dialog` for fuller click-to-open explanations
- circular help-trigger button with `?` symbol
- reusable help content pattern for form labels, planner tools, statuses, and admin actions

### Reusable App Patterns
- status badge pattern for pending, approved, and rejected
- section header pattern for consistent page structure
- summary row pattern for booking review and confirmation
- empty state pattern for no bookings or no slots
- error state pattern for failed load or unavailable selection
- loading skeleton pattern for venue content and dashboard data
- authenticated profile dropdown pattern with role-view switcher
- account settings form pattern for password update
- contextual help pattern with hover tooltip and click explanation modal

## Design Direction Summary
The app should feel:
- polished
- modern
- premium
- practical
- interactive
- user-friendly

The visual direction can still use wedding-style presentation as the showcase theme, but the product language should remain broad enough for general venue booking.

Examples of visual inspiration:
- dreamy hero imagery
- glassmorphism-inspired navigation and cards
- clean booking steps
- premium gallery presentation
- realistic venue previews
- tasteful event setup visuals
- warm soft lighting and rounded UI surfaces
