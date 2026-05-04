# NEST Frontend Architecture Documentation

## Overview
NEST is an Angular 21 application built to connect neighbors in apartment buildings. It follows a highly structured, scalable architecture using NgRx for state management, the Facade pattern to decouple components from the store, and Signals for local reactive state.

## Core Design Principles
1. **Dumb Components**: Feature components are presentational. They receive data via Inputs/Facade Signals and emit actions via Outputs/Facade Methods. They do NOT contain complex business logic.
2. **Facade Pattern**: All interaction with the NgRx store happens through a Facade service. This keeps components clean and makes testing easier.
3. **Signals over Observables in Templates**: We use Angular's `selectSignal` in Facades, meaning templates and components consume Signals (`data()`) rather than subscribing to Observables (`data$ | async`).
4. **No Side Effects in Components**: We explicitly avoid `effect()` in component files unless absolutely necessary. Side effects are handled by NgRx Effects.

## State Management (NgRx)
Each domain module (`feed`, `events`, `shed`, `parking`, `auth`) has a dedicated state slice consisting of 6 files:
- `*.state.ts`: Defines the interface and initial state.
- `*.actions.ts`: Defines action creators using `createActionGroup`.
- `*.reducer.ts`: Pure functions handling state updates.
- `*.effects.ts`: Side-effects (API calls) responding to actions.
- `*.selectors.ts`: Memoized queries to extract specific slices of state.
- `*.facade.ts`: The public API that components inject.

## Routing & Data Pre-fetching
Data required for a page is pre-fetched using **Route Resolvers**. This ensures that by the time a user navigates to a route (e.g., `/feed`), the data is already loading or loaded, eliminating initial "flicker".

```typescript
// app.routes.ts
{ 
  path: 'feed', 
  loadComponent: () => import('./features/feed/feed.component').then(c => c.FeedComponent),
  resolve: { data: feedResolver }
}
```

## Styling & Theme
The application uses SCSS. Tailwind CSS was removed to keep the styling architecture native and clean.
- `_variables.scss`: Contains all design tokens (Emerald/Amber palette, spacing, shadows).
- `_mixins.scss`: Reusable component styles (buttons, cards, inputs, glassmorphism).
- `_animations.scss`: Keyframes for micro-interactions (floating elements, spinners).

Each component has its own `.component.scss` file which primarily handles layout, delegating visual styles to the global mixins.
