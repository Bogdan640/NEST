# NEST — Figma AI Frontend Design Prompt

## App Overview
NEST is a **residential community web application** for apartment block residents. Think of it as a private social network + management tool for people living in the same building complex. The design should feel **warm, modern, and community-focused** — like a digital notice board that everyone in the building uses daily.

**Target users:** Apartment residents (ages 25–65), block administrators
**Platform:** Web application (responsive — desktop + tablet + mobile)
**Tone:** Friendly, clean, trustworthy, modern

---

## Design Direction
- **Style:** Clean modern UI with soft rounded corners, subtle shadows, warm color palette
- **Primary palette:** Warm earthy greens (nature/nest theme) + neutral whites/grays
- **Accent:** Soft amber/orange for CTAs and highlights
- **Typography:** Modern sans-serif (Inter or similar)
- **Icons:** Outlined, friendly style (Lucide or Phosphor)
- **Dark mode:** Support both light and dark themes (user preference toggle)
- **Feel:** Approachable, not corporate. Like Nextdoor meets a premium building management app.

---

## Pages to Design

### PAGE 1: Login Page
- Clean centered login form with email + password fields
- "Login" primary button
- "Don't have an account? Register" link below
- NEST logo/branding at the top
- Subtle background illustration of apartment buildings or community

### PAGE 2: Registration Page
- Form fields: First Name, Last Name, Email, Password, Apartment Number
- "Create Account" primary button
- "Already have an account? Login" link
- Same branding as login page

### PAGE 3: Block Code Entry Page (Post-Registration)
- Shown after registration. Minimal, focused layout
- Large heading: "Join Your Building"
- Subtitle: "Enter the unique code for your apartment block to join your community"
- Single large input field for the block code
- "Submit" button
- Status message area showing "Pending admin approval" after submission
- Illustration of a key or door opening

### PAGE 4: Pending Approval Page
- Shown while waiting for admin approval
- Centered content with a friendly waiting illustration
- Text: "Your request is being reviewed by the block administrator"
- "You'll be notified once approved"
- Logout option

### PAGE 5: Main Dashboard / Feed Page
- **Top navigation bar** with:
  - NEST logo (left)
  - Navigation tabs: Feed, Events, Shared Shed, Parking
  - User avatar + dropdown menu (right) with: Profile, Settings, Logout
  - Admin badge/indicator if user is admin
- **Left sidebar** (desktop): Quick stats (residents online, upcoming events, available tools)
- **Main content area**: Feed of community posts in card format
  - Each post card shows: Author avatar + name, timestamp, post content, optional image
  - "Write a post" input/button at the top of the feed
  - Admin sees delete button on ALL posts; regular users only on their own
- **Pagination** controls at bottom
- Search bar for filtering posts
- **Daily post limit indicator** (e.g., "1/1 post today" subtle badge)

### PAGE 6: Events Page
- **List view** of event cards (default) with option for **calendar view**
- Each event card shows:
  - Title, type badge (MEETING / SOCIAL / MAINTENANCE / OTHER — color-coded)
  - Date/time, location
  - Attendee count vs max capacity (progress bar)
  - Creator name
  - "Join" / "Leave" button
  - Visibility badge (ALL / BUILDING / FLOOR)
- **"Create Event" floating action button**
- Filter/sort controls: by type, by date, search
- Admin sees edit/delete on all events

### PAGE 7: Create/Edit Event Modal
- Form fields: Title, Description, Location, Type (dropdown), Start Date/Time, End Date/Time, Max Participants (optional), Visibility (dropdown)
- "Create Event" / "Save Changes" button
- Clean modal overlay design

### PAGE 8: Shared Shed Page
- Grid or list of resource cards
- Each resource card shows:
  - Tool/book icon based on type, name, description
  - Owner name (or "Community" badge if community-owned)
  - Status indicator: Available (green), Borrowed (red), Cooldown (yellow)
  - "Reserve" button (if available)
  - "Return" button (if currently borrowed by this user)
- **"Add Resource" button**
- Filter by type (TOOL / BOOK / OTHER), search
- Admin sees edit/delete on all resources

### PAGE 9: Reserve Resource Modal
- Resource name and details at top
- Date/time pickers for start and end time
- "Reserve" confirmation button
- Warning if resource is on cooldown with countdown timer

### PAGE 10: Parking Page
- **Two tabs**: "Announcements" (available parking spots) and "My Slots" (user's own slots)
- **Announcements tab:**
  - Cards for each available parking announcement
  - Shows: Slot identifier, available dates, publisher name, apartment number
  - Number of applications badge
  - "Apply" button for each announcement
  - Publisher sees "Approve" / "Reject" buttons on applications
- **My Slots tab:**
  - List of user's own parking slots
  - "Create Slot" button
  - "Announce Availability" button for each slot
- Search/sort/pagination controls

### PAGE 11: User Profile Page (Own)
- Profile header: Large avatar (editable), full name, apartment number, headline
- About section (editable text area)
- Contact info: Email (read-only), Phone (editable), phone visibility toggle
- Statistics: Posts count, events attended, tools shared
- Theme toggle (light/dark)
- "Save Changes" button

### PAGE 12: User Profile Page (Other User — Public)
- View-only version showing: Avatar, name, apartment, headline, about
- Phone number shown only if user set it to public
- Block/community badge

### PAGE 13: Admin Panel Page (Admin Only)
- **Tab 1: Pending Approvals**
  - List of pending users with: Name, email, apartment number, registration date
  - "Approve" (green) and "Reject" (red) buttons for each
  - Empty state: "No pending requests" with illustration
- **Tab 2: Block Residents**
  - List of all verified residents
  - "Remove from block" option for each (with confirmation dialog)
  - Search/filter by name or apartment
- **Tab 3: Block Settings**
  - Block name, address, unique join code (copyable)
  - Block code display with copy-to-clipboard button

### PAGE 14: Settings Page
- Theme: Light / Dark toggle
- Phone visibility: Public / Private toggle
- Password change form
- Account section

### PAGE 15: 404 / Error Page
- Friendly illustration
- "Page not found" or error message
- "Go back to feed" button

---

## Component System (Reusable)
Design these as reusable components:

1. **Post Card** — author, content, timestamp, actions (edit/delete)
2. **Event Card** — title, badges, time, capacity bar, join/leave
3. **Resource Card** — name, type icon, status badge, reserve/return
4. **Parking Card** — slot identifier, dates, apply/approve buttons
5. **User Avatar** — profile image with fallback initials, optional admin badge
6. **Navigation Bar** — logo, tabs, user menu
7. **Modal/Dialog** — create/edit forms
8. **Empty State** — illustration + message for empty lists
9. **Pagination** — page controls with total count
10. **Form Input** — text, email, password, date-time, dropdown, toggle
11. **Badge/Chip** — for event types, resource status, roles
12. **Alert/Toast** — success, error, info notifications
13. **Confirmation Dialog** — for destructive actions (delete, remove user)

---

## User Flows to Consider

### Flow 1: New Resident Onboarding
`Registration → Block Code Entry → Pending Approval → Dashboard`

### Flow 2: Daily Usage
`Login → Feed (read/write posts) → Check Events → Browse Shed → Check Parking`

### Flow 3: Admin Workflow
`Login → Admin Panel → Review Pending Users → Approve/Reject → Manage Residents`

### Flow 4: Shed Full Lifecycle
`Browse Resources → Reserve Tool → Use Tool → Return Tool → (Tool enters cooldown)`

### Flow 5: Parking Full Lifecycle
`Create Slot → Announce Availability → Residents Apply → Publisher Approves One → Others Auto-Rejected`

---

## Role-Based UI Rules

| UI Element | RESIDENT sees | ADMIN sees |
|------------|---------------|------------|
| Edit/Delete buttons on own content | ✅ | ✅ |
| Edit/Delete buttons on others' content | ❌ | ✅ |
| Admin Panel nav item | ❌ | ✅ |
| Admin badge on avatar | ❌ | ✅ |
| Approve/Reject users | ❌ | ✅ |
| Block settings | ❌ | ✅ |

---

## Responsive Breakpoints
- **Desktop** (1200px+): Full sidebar + main content
- **Tablet** (768px–1199px): Collapsed sidebar, full nav
- **Mobile** (< 768px): Bottom tab navigation, stacked cards, hamburger menu
