# NEST Bachelor's Thesis -- Code Mapping Dictionary

This documentation file bridges the high-level academic claims, design patterns, and engineering concepts described in your Bachelor's Thesis directly to the actual files, directories, and specific lines of source code in the **NEST** application repository. Use this reference when preparing your presentation slides or defending your thesis!

---

## 1. The CSS Design Token and Theming System

### What is it?
A **design token system** is a modern styling methodology that separates core design values (such as branding palettes, spacing systems, shadow levels, and component-specific style properties) from CSS helper classes or hardcoded hex colors. 
In the NEST application, this design token system is realized through **over 600 CSS Custom Properties (Variables)** declared inside a centralized stylesheets directory. These tokens are declared globally on the `:root` pseudo-class (for light theme) and overridden on the `[data-theme='dark']` selector (for dark theme). Components never declare raw hex colors or hardcoded paddings; they refer exclusively to semantic CSS variables (e.g., `color: var(--color-text-primary)`). 
Because variables are declared at the root element level, the browser instantly updates the computed styles across the entire DOM tree when the `data-theme` attribute on the `document.body` or `html` is modified, achieving zero-lag theme transitions without single-page re-renders.

### Key File Locations:
- **Central Token Dictionary:** [\_colors.scss](file:///d:/School/3rdY_S2/Licenta/NEST/frontend/src/app/shared/styles/_colors.scss)
  - *Light Theme Definition:* Lines 9–254 declare `:root` variables (brand emerald, neutrals grey, semantic bg/surfaces, button shadows).
  - *Dark Theme Definition:* Lines 256–608 declare the `[data-theme='dark']` overrides, establishing a sleek, high-contrast dark theme with consistent hues.
- **Layout & Spacing Tokens:** 
  - [\_spacing.scss](file:///d:/School/3rdY_S2/Licenta/NEST/frontend/src/app/shared/styles/_spacing.scss) defines standard padding, margins, and gaps.
  - [\_layout.scss](file:///d:/School/3rdY_S2/Licenta/NEST/frontend/src/app/shared/styles/_layout.scss) defines breakpoint containers, responsive drawer widths, and z-index structures.
  - [\_index.scss](file:///d:/School/3rdY_S2/Licenta/NEST/frontend/src/app/shared/styles/_index.scss) serves as the SCSS barrel file importing all modular tokens.
- **Reactive Theme Core Service:** [theme.service.ts](file:///d:/School/3rdY_S2/Licenta/NEST/frontend/src/app/core/services/theme.service.ts)
  - Uses an Angular `signal<string>('light')` to track active visual state.
  - An Angular `effect()` reactively updates the `document.body`'s attribute: `document.body.setAttribute('data-theme', current)` and syncs the preference with `localStorage`.
- **User Interface Control:** [settings.component.ts](file:///d:/School/3rdY_S2/Licenta/NEST/frontend/src/app/features/settings/settings.component.ts)
  - Consumes `ThemeService` and updates preferences via the UI theme switcher cards.

---

## 2. Automated Conflict-Resolution and Double-Booking Engines

### Tool Sharing (Shared Shed) Conflict Preventions
- **Key Location:** [shedService.ts](file:///d:/School/3rdY_S2/Licenta/NEST/backend/src/services/shed/shedService.ts)
- **Active Conflict Prevention Check (Lines 100–103):**
  ```typescript
  const isEngaged = resource.reservations.some(res => res.status === 'APPROVED' && res.endTime > new Date());
  if (isEngaged) {
    throw new ConflictError('This item is already borrowed by someone else');
  }
  ```
  This check scans the relational reservations array before instantiating a new borrow claim. If an approved reservation is active and its end-time is in the future, the system blocks booking attempts with a `ConflictError` payload.
- **Mandatory Tool Cooldown Period (Lines 105–117):**
  ```typescript
  if (resource.type === 'TOOL' && resource.reservations.length > 0) {
    const previousReservation = resource.reservations[0];
    if (previousReservation && previousReservation.status === 'RETURNED') {
      const borrowedDurationMs = previousReservation.endTime.getTime() - previousReservation.startTime.getTime();
      const cooldownMs = borrowedDurationMs / 24;
      const cooldownExpiration = new Date(previousReservation.updatedAt.getTime() + cooldownMs);
      ...
      if (new Date() < cooldownExpiration) {
        throw new ConflictError(`This item is in a mandatory cooldown period...`);
      }
    }
  }
  ```
  Enforces a mechanical maintenance cooldown on physical items categorized as `TOOL`. The cooldown is dynamically calculated as `1/24th` of the duration it was borrowed, preventing tool wear.

### Parking Spot Allocation Auto-Rejection
- **Key Location:** [parkingService.ts](file:///d:/School/3rdY_S2/Licenta/NEST/backend/src/services/parking/parkingService.ts)
- **Approval Claim Verification (Lines 136–145):**
  Ensures that when approving a parking application, no other application for the same parking announcement has already been approved:
  ```typescript
  const existingApproval = await prisma.parkingApplication.findFirst({
    where: {
      announcementId: targetedApplication.announcementId,
      status: 'APPROVED'
    }
  });
  if (existingApproval) throw new ConflictError('Parking slot already claimed by another resident');
  ```
- **Cascading Overlap Auto-Rejection (Lines 147–153):**
  Once an owner approves a booking, the backend runs a single cascading update query to deny all other overlapping applications:
  ```typescript
  await prisma.parkingApplication.updateMany({
    where: {
      announcementId: targetedApplication.announcementId,
      id: { not: applicationIdValue }
    },
    data: { status: 'REJECTED' }
  });
  ```
  This automatically transitions all other concurrent applications to `REJECTED`, preventing double-booking and resolving slot claim conflicts.

---

## 3. Facade-Signals Reactive Architecture

### What is it?
To separate presentation concerns from NgRx Redux boilerplate, NEST utilizes the **Facade Pattern**. Standalone components never inject the NgRx store directly. Instead, they inject read-only Facades, which expose store selectors wrapped as modern **Angular Signals** via `selectSignal()`. This hybrid pattern provides fine-grained visual updates in HTML templates while maintaining a robust, single-source-of-truth state machine.

### Key File Locations:
- **Authentication Facade State Wrapper:** [auth.facade.ts](file:///d:/School/3rdY_S2/Licenta/NEST/frontend/src/app/store/auth/auth.facade.ts)
  - *Store Signal Selectors (Lines 22–30):* Exposes reactive slices:
    ```typescript
    currentUser = this.store.selectSignal(selectCurrentUser);
    isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
    isVerified = this.store.selectSignal(selectIsVerified);
    isAdmin = this.store.selectSignal(selectIsAdmin);
    ```
  - *Store Action Dispatches (Lines 32–42):* Exposes state-modifying actions as clean class methods: `login()`, `register()`, `joinBlock()`, `logout()`.
- **Selector Definitions:** [auth.selectors.ts](file:///d:/School/3rdY_S2/Licenta/NEST/frontend/src/app/store/auth/auth.selectors.ts) contains the pure memoized selectors that slice the state.

---

## 4. Multi-Stage Block Verification & Onboarding Pipeline

### What is it?
When a resident registers, they are initially in an unverified state (`isVerified: false`, `blockId: null`). To ensure data confidentiality, route guards block them from accessing any building-specific features, directing them to an onboarding workspace to submit their building registration. Access is only unlocked when the physical building block's administrator approves their registration from the Admin Panel.

### Key File Locations:
- **Frontend Route Guard Pipeline:** [app.routes.ts](file:///d:/School/3rdY_S2/Licenta/NEST/frontend/src/app/app.routes.ts)
  - Chained functional route guards: `canActivate: [AuthGuard, PendingGuard]` secure sensitive features like `feed`, `shed`, `events`, and `parking`.
- **Pending Onboarding Guard:** [pending.guard.ts](file:///d:/School/3rdY_S2/Licenta/NEST/frontend/src/app/core/guards/pending.guard.ts)
  - Directs logged-in users with a `null` `blockId` directly to the `join-block` page.
- **Backend Security Middleware Pipeline:** [authMiddleware.ts](file:///d:/School/3rdY_S2/Licenta/NEST/backend/src/middlewares/authMiddleware.ts)
  - `requireAuthentication` (Lines 9–33): Decodes outgoing authorization headers and validates JWT signature integrity.
  - `requireVerified` (Lines 35–47): Restricts route access if the active `User.isVerified` flag is false, returning a 403 Forbidden status.
  - `requireAdminRole` (Lines 49–61): Enforces role-based checks, blocking standard users from administrative endpoints.
