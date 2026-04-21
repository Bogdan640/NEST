# NEST Platform Backend 

Welcome to the absolute core of the NEST Web Application infrastructure. 
This document explicitly maps the rigorous backend domain, tracking the flow of traffic from HTTP mapping straight down to the Prisma execution layer, completely adhering to our strict "Zero-comments" coding architecture. 

## Table of Contents
1. [System Architecture Flow](#system-architecture-flow)
2. [Environment Configuration (`.env`)](#environment-configuration)
3. [Swagger API Documentation & Tutorial](#swagger-api-documentation--tutorial)
4. [File & Directory Rigorous Breakdown](#file--directory-rigorous-breakdown)
5. [Database Operations & Database Schema](#database-operations)
6. [Testing Environment Breakdown](#testing-environment-breakdown)

---

## System Architecture Flow

The application executes logic following a heavily segregated layered pattern that explicitly disallows tangled responsibilities. Every HTTP request enters via `server.ts` -> passes the router -> goes immediately downstream:
1. **Routes Layer (`/routes`)**: Maps explicit URL endpoints (e.g. `POST /api/v1/feed`) to particular Controller methods. Protects resources via `authMiddleware`.
2. **Controller Layer (`/controllers`)**: Retrieves `req.body`, `req.params`, handles basic payload validations, calls the Service, and formulates strict HTTP status responses (e.g., `200 OK`, `409 Conflict`).
3. **Service Layer (`/services`)**: Enforces pure business constraints. Connects directly to the `PrismaClient` to retrieve/mutate state. Throws explicit TypeScript Error instances if domain constraints are breached (e.g. cooldown limits, duplication loops).
4. **Data Access (Prisma)**: Models strictly shaped within `schema.prisma`. 

---

## Environment Configuration

Following elite backend standards, confidential values are isolated within the root `.env` file rather than hardcoded in the logic pipelines. The backend consumes the following key variables directly from your system environment.
```dotenv
# Database protocol configuration locating our SQLite storage engine natively
DATABASE_URL="file:./dev.db"

# The literal networking port for our Express instance to listen on natively
PORT=3000

# The strictly private cryptographic signature key used for signing specific JSON Web Tokens
JWT_SECRET="strict_production_nest_secret_key!981"
```

## Swagger API Documentation & Tutorial

The backend visually documents and auto-exposes all configuration limits directly through Swagger UI, dynamically mounting alongside the primary Express pipeline.

**To access the documentation actively running:**
1. Execute `npm run dev` in your `/backend` directory.
2. In your browser natively navigate to: **`http://localhost:3000/api-docs`**

**Tutorial (How to interact via Swagger):**
1. Look for the `POST /api/v1/auth/login` endpoint dynamically rendered. Provide the mock data credentials inside the JSON object (`email: magdalena.potarniche@nest.local`, `password: parola123`).
2. Execute the login. The interface will return a `eyJhbGciOi...` JWT token string.
3. Click the explicit green **Authorize** padlock button at the top of the screen.
4. Input your token formatted specifically with the `Bearer ` prefix (e.g., `Bearer eyJhbG...`) into the field.
5. You are now entirely authorized. Every time you hit "Try it out" for the Parking, Shed, Events, or Feed endpoints, Swagger securely injects your resident payload logic natively!

---

## File & Directory Rigorous Breakdown

To comply completely with our core directive, every single file has a localized purpose with zero comments inside the source code files themselves.

### `src/server.ts`
The highest level execution context. It pulls `app.ts` logic into memory, probes `process.env.PORT`, and fires the Express node server to listen for web traffic.

### `src/app.ts`
The localized middleware wrapper. Injects cross-origin constraint permissions (`cors()`), enables global JSON body parsing (`express.json()`), hooks the Swagger route to `/api-docs`, and stitches all individual sub-routers locally to `/api/v1/...`.

### `src/middlewares/authMiddleware.ts`
Provides `requireAuthentication` protecting guarded routes heavily by intercepting `Authorization: Bearer <token>`, dropping invalid instances via `401 Unauthorized` instantly. Includes the strict `requireAdminRole` verifying `req.user.role === 'ADMIN'` for absolute constraints.

### `src/utils/jwtUtils.ts`
The strict node wrapping over `jsonwebtoken`. Provides `generateToken` binding resident payloads with an exact 1-day expiration duration limit. Exports `verifyToken` natively forcing error-catches down to `null` states explicitly.

### The Specific Domains (`/controllers`, `/services`, `/routes`)
1. **Feed (`/feed`)**: 
   - Uses `feedService.ts` to block duplicate local posts by comparing the `createdAt` timestamp boundary specifically over `new Date()`. Limits explicit users cleanly to literally 1 post a day.
2. **Events (`/events`)**: 
   - Calculates capacities and actively denies `joinTargetEvent` if `attendees.length >= maxParticipants`, returning HTTP 409 structurally.
3. **Shed (`/shed`)**: 
   - Fuses library usage and tool booking constraints locally. When reserving a `TOOL`, calculates `borrowedDurationMs` natively off the last reservation boundary explicitly casting a strict 24X slower `cooldownMs`. Rejects bookings directly if current real-time rests within the cooldown frame!
4. **Parking (`/parking`)**: 
   - Tracks 1x1 resident matching entirely. Inside `approveTargetApplication()`, once the publisher commits to one applicant dynamically, Prisma runs an `updateMany` completely rewriting every single other simultaneous applicant state to `REJECTED`. 

---

## Database Operations

Everything translates down to **SQLite**, entirely abstracted by **Prisma 6.4.1**.
- **`prisma/schema.prisma`**: The declarative source mapping explicit definitions for `User`, `Post`, `Event`, `Resource`, `ParkingSlot`, etc. Natively handles mapping multi-layer relationships natively including `EventAttendee` (`@@id([userId, eventId])`).
- **`prisma/seed.ts`**: The injection script executing sequentially to mock data. Loads `Magdalena Potârniche` automatically with full bcrypt hash encryption natively bypassing controllers completely.
- **`dev.db`**: The final literal database artifact residing statically in `/backend` folder.
- **Data Execution Commands**: 
  - Deploy explicit schemas via: `npx prisma db push`
  - Seed baseline entities strictly: `npm run prisma seed`

---

## Testing Environment Breakdown

The application maintains strict absolute global code coverage safely hitting **~85.3% statement coverage** natively across exactly 36 Jest tests, completely isolating and validating business constraints automatically via Supertest HTTP calls.

- **`test/middlewares/authMiddleware.test.ts`**: Triggers fake requests validating precise HTTP code rejections (`403` vs `401`) locally.
- **`test/events/eventsRoutes.test.ts`**: Fully generates mock residents in real-time, executing dynamic attempts to break maximum participant parameters directly.
- **`test/parking/parkingRoutes.test.ts`**: Simulates concurrent users actively locking each other locally specifically trying to test the `409` matching restrictions dynamically.
- **`test/shed/shedRoutes.test.ts`**: Evaluates the mathematical algorithm locally, natively pushing active tools into strict cooldown frameworks and catching the expected denial completely via DB injection mutations. 

To execute manually natively: `npm run test` or `npx jest --coverage`.

