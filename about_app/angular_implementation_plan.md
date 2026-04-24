# NEST Frontend — Angular 21 Implementation Plan (v2)

## Goal

Rebuild the Figma-generated React prototype into a production-ready Angular 21 application that connects to the existing NEST backend API. The Figma `src/` files remain as **design reference only**.

---

## Key Design Principles

| Principle | Rule |
|-----------|------|
| **Dumb Components** | Feature components are presentational only. They receive data via `@Input()` and emit via `@Output()`. All logic lives in Facades/Services |
| **Facade Pattern** | Each NgRx store is accessed ONLY through its Facade service. Components never import Store, dispatch actions, or use selectors directly |
| **Signals** | Use Angular `signal()` / `computed()` for local component state (filters, tabs, form visibility). Use NgRx selectors (exposed via Facade as `Signal`) for domain state |
| **No `effect()`** | Avoid `effect()` in components. If absolutely required, document the reason in the Facade. Prefer `computed()` or RxJS operators in Effects |
| **Lazy Loading** | Every feature route uses `loadComponent` / `loadChildren`. Use `@defer` for heavy sub-components (dialogs, charts) |
| **No Inline CSS** | Every component has its own `.scss` file. Zero `style` attributes in templates |
| **No Comments** | Use suggestive, self-documenting names for variables, methods, components, and files |
| **No Magic Numbers** | All constants (colors, sizes, limits, roles) live in dedicated constant files |
| **Resolvers** | Use route resolvers to pre-fetch data before a page renders — no loading spinners on initial navigation |
| **Separate SCSS** | Each component gets its own `.component.scss`. Shared tokens live in `styles/_variables.scss` |

---

## Proxy Config Explained

> [!NOTE]
> **What is the proxy?** When you run `ng serve`, Angular's dev server runs on `http://localhost:4200`. Your backend runs on `http://localhost:3000`. Browsers block cross-origin requests (CORS). Instead of relaxing CORS, we tell Angular's dev server: *"when you see a request to `/api/v1/*`, forward it to `http://localhost:3000`"*.

**How it works:**

```
Browser → http://localhost:4200/api/v1/feed → Angular Dev Server (proxy) → http://localhost:3000/api/v1/feed
```

**Implementation:** A single file `proxy.conf.json` in the frontend root:

```json
{
  "/api/v1": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  }
}
```

Then in `angular.json`, the `serve` configuration references it:
```json
"serve": {
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}
```

**This is NOT a code folder.** It's a single config file. In production, you'd use a reverse proxy (Nginx) instead.

---

## NgRx Store Structure (6 Files per Store + Facade Pattern)

Each domain store follows this exact structure:

```
src/app/store/auth/
├── auth.state.ts          # Interface for this slice of state + initial state
├── auth.actions.ts        # Action creators (createActionGroup)
├── auth.reducer.ts        # Pure reducer function
├── auth.effects.ts        # Side effects (API calls)
├── auth.selectors.ts      # Memoized selectors
└── auth.facade.ts         # Facade service — the ONLY public API
```

### Facade Pattern Example

```typescript
// auth.facade.ts
@Injectable({ providedIn: 'root' })
export class AuthFacade {
  // Expose selectors as Signals (not Observables) for template use
  currentUser = this.store.selectSignal(AuthSelectors.selectCurrentUser);
  isAdmin = this.store.selectSignal(AuthSelectors.selectIsAdmin);
  isLoading = this.store.selectSignal(AuthSelectors.selectIsLoading);
  error = this.store.selectSignal(AuthSelectors.selectError);

  constructor(private store: Store) {}

  login(email: string, password: string): void {
    this.store.dispatch(AuthActions.login({ email, password }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
```

### Component Usage (Dumb)

```typescript
// login.component.ts — NO Store import, NO dispatch, NO selector
@Component({ ... })
export class LoginComponent {
  private authFacade = inject(AuthFacade);

  isLoading = this.authFacade.isLoading;        // Signal<boolean>
  error = this.authFacade.error;                 // Signal<string | null>
  loginForm = inject(FormBuilder).group({ ... });

  onSubmit(): void {
    const { email, password } = this.loginForm.getRawValue();
    this.authFacade.login(email, password);      // Facade handles dispatch
  }
}
```

---

## Architecture Overview

```
frontend/
├── proxy.conf.json                    # Dev server proxy config (see above)
├── angular.json
├── package.json
└── src/
    ├── app/
    │   ├── core/                      # Singleton services, guards, interceptors
    │   │   ├── auth/
    │   │   │   ├── auth.guard.ts
    │   │   │   ├── verified.guard.ts
    │   │   │   └── auth.interceptor.ts
    │   │   ├── api/                   # HTTP services (one per backend module)
    │   │   │   ├── auth-api.service.ts
    │   │   │   ├── feed-api.service.ts
    │   │   │   ├── events-api.service.ts
    │   │   │   ├── shed-api.service.ts
    │   │   │   ├── parking-api.service.ts
    │   │   │   ├── user-api.service.ts
    │   │   │   └── admin-api.service.ts
    │   │   ├── models/                # TypeScript interfaces
    │   │   │   ├── user.model.ts
    │   │   │   ├── post.model.ts
    │   │   │   ├── event.model.ts
    │   │   │   ├── resource.model.ts
    │   │   │   ├── parking.model.ts
    │   │   │   └── paginated-response.model.ts
    │   │   ├── constants/
    │   │   │   ├── api-endpoints.ts   # All API paths
    │   │   │   ├── roles.ts           # ADMIN, RESIDENT
    │   │   │   ├── event-types.ts     # MEETING, SOCIAL, etc.
    │   │   │   ├── resource-types.ts  # TOOL, BOOK, OTHER
    │   │   │   └── ui.ts             # Page sizes, animation durations
    │   │   └── resolvers/
    │   │       ├── feed.resolver.ts
    │   │       ├── events.resolver.ts
    │   │       ├── shed.resolver.ts
    │   │       ├── parking.resolver.ts
    │   │       └── profile.resolver.ts
    │   ├── store/                     # NgRx state management
    │   │   ├── auth/
    │   │   │   ├── auth.state.ts
    │   │   │   ├── auth.actions.ts
    │   │   │   ├── auth.reducer.ts
    │   │   │   ├── auth.effects.ts
    │   │   │   ├── auth.selectors.ts
    │   │   │   └── auth.facade.ts
    │   │   ├── feed/                  # Same 6-file pattern
    │   │   │   ├── feed.state.ts
    │   │   │   ├── feed.actions.ts
    │   │   │   ├── feed.reducer.ts
    │   │   │   ├── feed.effects.ts
    │   │   │   ├── feed.selectors.ts
    │   │   │   └── feed.facade.ts
    │   │   ├── events/                # Same 6-file pattern
    │   │   │   ├── events.state.ts
    │   │   │   ├── events.actions.ts
    │   │   │   ├── events.reducer.ts
    │   │   │   ├── events.effects.ts
    │   │   │   ├── events.selectors.ts
    │   │   │   └── events.facade.ts
    │   │   ├── shed/                  # Same 6-file pattern
    │   │   │   ├── shed.state.ts
    │   │   │   ├── shed.actions.ts
    │   │   │   ├── shed.reducer.ts
    │   │   │   ├── shed.effects.ts
    │   │   │   ├── shed.selectors.ts
    │   │   │   └── shed.facade.ts
    │   │   ├── parking/               # Same 6-file pattern
    │   │   │   ├── parking.state.ts
    │   │   │   ├── parking.actions.ts
    │   │   │   ├── parking.reducer.ts
    │   │   │   ├── parking.effects.ts
    │   │   │   ├── parking.selectors.ts
    │   │   │   └── parking.facade.ts
    │   │   └── index.ts               # Root state, meta-reducers
    │   ├── shared/                    # Reusable dumb components & pipes
    │   │   ├── components/
    │   │   │   ├── animal-logo/
    │   │   │   ├── page-header/
    │   │   │   ├── empty-state/
    │   │   │   ├── confirm-dialog/
    │   │   │   └── loading-spinner/
    │   │   ├── pipes/
    │   │   │   └── time-ago.pipe.ts
    │   │   └── directives/
    │   │       └── role.directive.ts  # *appIfRole="'ADMIN'"
    │   ├── layout/
    │   │   ├── layout.component.ts
    │   │   ├── layout.component.html
    │   │   └── layout.component.scss
    │   ├── features/                  # Lazy-loaded feature routes
    │   │   ├── auth/
    │   │   │   ├── login/
    │   │   │   │   ├── login.component.ts
    │   │   │   │   ├── login.component.html
    │   │   │   │   └── login.component.scss
    │   │   │   ├── register/
    │   │   │   ├── join-block/
    │   │   │   └── pending/
    │   │   ├── feed/
    │   │   │   ├── feed.component.ts|html|scss
    │   │   │   └── post-card/
    │   │   ├── events/
    │   │   │   ├── events.component.ts|html|scss
    │   │   │   ├── event-card/
    │   │   │   └── create-event-dialog/  # @defer loaded
    │   │   ├── shed/
    │   │   │   ├── shed.component.ts|html|scss
    │   │   │   ├── resource-card/
    │   │   │   └── add-resource-dialog/  # @defer loaded
    │   │   ├── parking/
    │   │   │   ├── parking.component.ts|html|scss
    │   │   │   ├── parking-card/
    │   │   │   └── create-announcement-dialog/  # @defer loaded
    │   │   ├── profile/
    │   │   ├── admin/
    │   │   └── settings/
    │   ├── app.ts
    │   ├── app.html                   # Just <router-outlet />
    │   ├── app.scss
    │   ├── app.config.ts
    │   └── app.routes.ts
    ├── environments/
    │   ├── environment.ts             # apiUrl: '/api/v1'
    │   └── environment.prod.ts        # apiUrl: 'https://nest-api.example.com/api/v1'
    ├── styles/
    │   ├── _variables.scss            # Design tokens
    │   ├── _mixins.scss               # Card, button, input mixins
    │   ├── _animations.scss           # Keyframes
    │   └── _typography.scss           # Font imports
    ├── styles.scss                    # Global imports
    ├── index.html
    └── main.ts
```

---

## Implementation Phases (Functionality First → Polish Last)

### Phase 1: Project Foundation (No Figma dependency)
> Infrastructure that stands on its own — no design, no workarounds

#### 1.1 Config & Environment
| Action | File |
|--------|------|
| [NEW] | `proxy.conf.json` — backend proxy |
| [MODIFY] | `angular.json` — add proxy to serve config |
| [NEW] | `src/environments/environment.ts` |
| [NEW] | `src/environments/environment.prod.ts` |

#### 1.2 Models & Constants
| Action | File |
|--------|------|
| [NEW] | `src/app/core/models/user.model.ts` |
| [NEW] | `src/app/core/models/post.model.ts` |
| [NEW] | `src/app/core/models/event.model.ts` |
| [NEW] | `src/app/core/models/resource.model.ts` |
| [NEW] | `src/app/core/models/parking.model.ts` |
| [NEW] | `src/app/core/models/paginated-response.model.ts` |
| [NEW] | `src/app/core/constants/api-endpoints.ts` |
| [NEW] | `src/app/core/constants/roles.ts` |
| [NEW] | `src/app/core/constants/event-types.ts` |
| [NEW] | `src/app/core/constants/resource-types.ts` |
| [NEW] | `src/app/core/constants/ui.ts` |

#### 1.3 API Services (plain HTTP, no NgRx yet)
| Action | File |
|--------|------|
| [NEW] | `src/app/core/api/auth-api.service.ts` |
| [NEW] | `src/app/core/api/feed-api.service.ts` |
| [NEW] | `src/app/core/api/events-api.service.ts` |
| [NEW] | `src/app/core/api/shed-api.service.ts` |
| [NEW] | `src/app/core/api/parking-api.service.ts` |
| [NEW] | `src/app/core/api/user-api.service.ts` |
| [NEW] | `src/app/core/api/admin-api.service.ts` |

#### 1.4 Auth Infrastructure
| Action | File |
|--------|------|
| [NEW] | `src/app/core/auth/auth.interceptor.ts` — JWT header + 401 handling |
| [NEW] | `src/app/core/auth/auth.guard.ts` — redirect if no token |
| [NEW] | `src/app/core/auth/verified.guard.ts` — redirect if not verified |

#### 1.5 NgRx Auth Store (6 files + Facade)
| Action | File |
|--------|------|
| [NEW] | `src/app/store/auth/auth.state.ts` |
| [NEW] | `src/app/store/auth/auth.actions.ts` |
| [NEW] | `src/app/store/auth/auth.reducer.ts` |
| [NEW] | `src/app/store/auth/auth.effects.ts` |
| [NEW] | `src/app/store/auth/auth.selectors.ts` |
| [NEW] | `src/app/store/auth/auth.facade.ts` |
| [NEW] | `src/app/store/index.ts` — root state |

#### 1.6 App Config & Routing
| Action | File |
|--------|------|
| [MODIFY] | `src/app/app.config.ts` — add HttpClient, animations, NgRx providers |
| [MODIFY] | `src/app/app.routes.ts` — all routes with guards + lazy loading |
| [MODIFY] | `src/app/app.html` — replace placeholder with `<router-outlet />` |
| [MODIFY] | `src/app/app.ts` — minimal root component |

---

### Phase 2: Auth Feature Pages (Direct translation, minimal styling)
> Forms and navigation logic — these translate 1:1 from Figma

| Action | Files | Figma Source |
|--------|-------|-------------|
| [NEW] | `features/auth/login/login.component.ts\|html\|scss` | `Splash.tsx` |
| [NEW] | `features/auth/register/register.component.ts\|html\|scss` | `Register.tsx` |
| [NEW] | `features/auth/join-block/join-block.component.ts\|html\|scss` | `Join.tsx` |
| [NEW] | `features/auth/pending/pending.component.ts\|html\|scss` | `Pending.tsx` |

**What translates directly:** Form fields, validation, routing logic, role assignment
**Signal usage:** `loginForm` state, `isSubmitting = signal(false)`, `errorMessage = signal('')`

---

### Phase 3: Layout & Navigation (Direct translation)
> Sidebar + bottom nav — structure translates directly

| Action | Files | Figma Source |
|--------|-------|-------------|
| [NEW] | `layout/layout.component.ts\|html\|scss` | `Layout.tsx` |

**What translates directly:** Nav items array, route-based active state, role-conditional admin link, user info display, logout action
**Signal usage:** `isMobileNavVisible = signal(false)` for hamburger menu

---

### Phase 4: Domain NgRx Stores (4 stores, 6 files each)
> All stores follow the same pattern. Built before feature pages.

| Store | Files (6 each) |
|-------|-------|
| `store/feed/` | `feed.state.ts`, `feed.actions.ts`, `feed.reducer.ts`, `feed.effects.ts`, `feed.selectors.ts`, `feed.facade.ts` |
| `store/events/` | Same pattern |
| `store/shed/` | Same pattern |
| `store/parking/` | Same pattern |

Each Facade exposes:
- **Signals** for data (`items`, `selectedItem`, `isLoading`, `error`, `totalCount`)
- **Methods** for actions (`load()`, `create()`, `update()`, `delete()`, domain-specific like `joinEvent()`, `reserveResource()`)

---

### Phase 5: Feature Pages (Functionality — plain HTML/SCSS)
> Build all pages with real API data. Minimal styling — just enough to be usable.

#### 5.1 Resolvers
| Action | File |
|--------|------|
| [NEW] | `core/resolvers/feed.resolver.ts` — pre-loads posts |
| [NEW] | `core/resolvers/events.resolver.ts` |
| [NEW] | `core/resolvers/shed.resolver.ts` |
| [NEW] | `core/resolvers/parking.resolver.ts` |
| [NEW] | `core/resolvers/profile.resolver.ts` |

#### 5.2 Feed Feature
| Action | File | Figma Source |
|--------|------|-------------|
| [NEW] | `features/feed/feed.component.ts\|html\|scss` | `Feed.tsx` |
| [NEW] | `features/feed/post-card/post-card.component.ts\|html\|scss` | `PostCard.tsx` |

- **PostCard** is 100% dumb: `@Input() post`, `@Input() canDelete`, `@Output() deleteClicked`
- **FeedComponent** injects `FeedFacade`, passes data down
- **Signal usage:** `newPostContent = signal('')`

#### 5.3 Events Feature
| Action | File | Figma Source |
|--------|------|-------------|
| [NEW] | `features/events/events.component.ts\|html\|scss` | `Events.tsx` |
| [NEW] | `features/events/event-card/event-card.component.ts\|html\|scss` | `EventCard.tsx` |
| [NEW] | `features/events/create-event-dialog/create-event-dialog.component.ts\|html\|scss` | (new, no Figma equivalent) |

- **EventCard** dumb: `@Input() event`, `@Input() isAttending`, `@Output() joinClicked`, `@Output() leaveClicked`, `@Output() deleteClicked`
- **Signal usage:** `activeFilter = signal('ALL')`, `filteredEvents = computed(() => ...)` filtering from Facade data
- **`@defer`:** `create-event-dialog` loaded only when FAB clicked

#### 5.4 Shed Feature
| Action | File | Figma Source |
|--------|------|-------------|
| [NEW] | `features/shed/shed.component.ts\|html\|scss` | `Shed.tsx` |
| [NEW] | `features/shed/resource-card/resource-card.component.ts\|html\|scss` | `ResourceCard.tsx` |
| [NEW] | `features/shed/add-resource-dialog/add-resource-dialog.component.ts\|html\|scss` | (new) |

- **ResourceCard** dumb: `@Input() resource`, `@Input() canReserve`, `@Input() canReturn`, `@Input() canDelete`, `@Output()` for each action
- **Signal usage:** `activeFilter = signal('ALL')`, `filteredResources = computed()`

#### 5.5 Parking Feature
| Action | File | Figma Source |
|--------|------|-------------|
| [NEW] | `features/parking/parking.component.ts\|html\|scss` | `Parking.tsx` |
| [NEW] | `features/parking/parking-card/parking-card.component.ts\|html\|scss` | `ParkingCard.tsx` |
| [NEW] | `features/parking/create-announcement-dialog/create-announcement-dialog.component.ts\|html\|scss` | (new) |

- **Signal usage:** `activeTab = signal<'announcements' | 'mySlots'>('announcements')`

#### 5.6 Profile, Admin, Settings
| Action | File | Figma Source |
|--------|------|-------------|
| [NEW] | `features/profile/profile.component.ts\|html\|scss` | `Profile.tsx` |
| [NEW] | `features/admin/admin.component.ts\|html\|scss` | `Admin.tsx` |
| [NEW] | `features/settings/settings.component.ts\|html\|scss` | `Settings.tsx` |

---

### Phase 6: Shared Components & Pipes (Utility layer)

| Action | File | Figma Source |
|--------|------|-------------|
| [NEW] | `shared/components/animal-logo/` | `AnimalLogo.tsx` |
| [NEW] | `shared/components/page-header/` | `PageHeader.tsx` |
| [NEW] | `shared/components/empty-state/` | Inline in Events/Shed/Parking |
| [NEW] | `shared/components/loading-spinner/` | (new) |
| [NEW] | `shared/components/confirm-dialog/` | (new) |
| [NEW] | `shared/pipes/time-ago.pipe.ts` | `formatDistanceToNow` usage |
| [NEW] | `shared/directives/role.directive.ts` | Admin-only sections |

---

### Phase 7: Design System & Visual Polish (Workaround Phase)
> Now that everything WORKS, apply the Figma emerald/nature aesthetic

#### 7.1 Design Tokens & Mixins
| Action | File |
|--------|------|
| [NEW] | `src/styles/_variables.scss` — emerald palette, amber accent, radius, shadows |
| [NEW] | `src/styles/_mixins.scss` — card, btn-primary, btn-accent, input-field, glassmorphism |
| [NEW] | `src/styles/_typography.scss` — Inter font, heading sizes |
| [NEW] | `src/styles/_animations.scss` — fadeSlideIn, scaleIn, floatLeaf keyframes |
| [MODIFY] | `src/styles.scss` — import all partials |

**Workaround mapping (Tailwind → SCSS):**

| Tailwind (Figma) | SCSS Equivalent |
|-------------------|-----------------|
| `bg-emerald-50`, `text-emerald-900` | CSS custom properties `var(--color-surface)`, `var(--color-text-primary)` |
| `rounded-[2rem]` | `border-radius: $radius-card` |
| `shadow-xl shadow-emerald-200` | `box-shadow: $shadow-card` |
| `backdrop-blur-2xl` | `@include glassmorphism` |
| `px-5 py-4` | `padding: $spacing-md $spacing-lg` |

#### 7.2 Animation Workarounds

| Framer Motion (Figma) | Angular Equivalent |
|----------------------|-------------------|
| `motion.div initial/animate` | `@trigger` in component metadata with `:enter` transition |
| `AnimatePresence` + exit | `:leave` trigger on `*ngIf` / `@if` |
| `whileHover={{ scale: 1.02 }}` | `:hover` in SCSS: `transform: scale(1.02)` |
| `whileTap={{ scale: 0.98 }}` | `:active` in SCSS: `transform: scale(0.98)` |
| Floating leaf `animate={{ y: [0, -10, 0] }}` | `@keyframes float` in SCSS |
| Spring physics | `cubic-bezier(0.34, 1.56, 0.64, 1)` easing |

#### 7.3 Icon Workarounds

| Figma | Angular |
|-------|---------|
| `lucide-react` | `lucide-angular` (same icon names, Angular wrapper) |

#### 7.4 Apply Styling to All Components
- Update every `.component.scss` file to use the design tokens and mixins
- Add route transition animations to layout
- Add hover/active micro-interactions to cards and buttons

---

### Phase 8: Cleanup & Finalization

| Action | Description |
|--------|-------------|
| Remove React files | Delete `App.tsx`, `routes.tsx`, `main.tsx`, `context/`, `pages/`, `components/*.tsx`, `store/*-store/` (empty React dirs) |
| Remove Tailwind | Delete `styles/tailwind.css`, `styles/theme.css`, `styles/fonts.css`, `styles/index.css` |
| Remove unused deps | Clean `package.json` of any React-specific packages |
| Production build | `ng build --configuration=production` — verify no errors |
| [NEW] | `about_app/frontend_documentation.md` — architecture, patterns, how-to |
| [NEW] | `about_app/frontend_instructions.md` — setup, run, deploy instructions |

---

## `effect()` Policy

> [!WARNING]
> Angular's `effect()` should be **avoided** in components. It creates implicit reactive chains that are hard to debug. Here's the decision tree:

```
Need to react to state changes?
├── In a TEMPLATE → use signal/computed directly
├── In RESPONSE TO USER ACTION → call a method
├── In NgRx → use Effects (RxJS-based, properly managed)
└── ONLY if none of the above work → use effect() and DOCUMENT WHY
```

If `effect()` is ever used, it will be:
1. Inside a Facade or Service (never a component)
2. Accompanied by a `// REASON: ...` explaining why alternatives don't work
3. Limited to side effects like localStorage sync

---

## Dependencies to Install

```bash
npm install lucide-angular date-fns @angular/animations
```

Everything else (Angular Material, NgRx, RxJS) is already installed.

---

## Files to Create Summary

| Category | Count |
|----------|-------|
| Config & Environment | 4 |
| Models & Constants | 11 |
| API Services | 7 |
| Auth Infrastructure | 3 |
| NgRx Stores (5 × 6 files + index) | 31 |
| Resolvers | 5 |
| Feature Components (11 pages × 3 files) | 33 |
| Shared Components & Pipes | 18 |
| Styles | 4 |
| Documentation | 2 |
| **Total** | **~118 files** |

---

## Verification Plan

### Phase-by-Phase Testing
1. **Phase 1**: `ng serve` compiles, proxy forwards to backend, auth interceptor attaches JWT
2. **Phase 2**: Login → register → join-block → pending flow works end-to-end
3. **Phase 3**: Layout renders, nav works, active states correct
4. **Phase 4**: NgRx DevTools shows actions/state for all 5 stores
5. **Phase 5**: CRUD operations on all modules (feed/events/shed/parking), pagination, filters
6. **Phase 6**: Shared components render correctly
7. **Phase 7**: Visual match to Figma design, animations smooth
8. **Phase 8**: Production build succeeds, zero warnings

### Backend Integration Test
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && ng serve
```
Login with seeded user, perform CRUD on each module, test admin panel.
