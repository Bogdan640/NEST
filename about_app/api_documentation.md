# NEST Backend — API Documentation (v2.0)

Complete reference for all API endpoints. Base URL: `http://localhost:3000/api/v1`

All protected endpoints require: `Authorization: Bearer <token>`

> **Note:** Users must be `isVerified: true` (approved by block admin) to access Feed, Events, Shed, Parking, and Users endpoints.

---

## Table of Contents
1. [Auth](#1-auth)
2. [Users](#2-users)
3. [Admin](#3-admin)
4. [Feed](#4-feed)
5. [Events](#5-events)
6. [Shared Shed](#6-shared-shed)
7. [Parking](#7-parking)
8. [Pagination](#8-pagination)
9. [Error Handling](#9-error-handling)
10. [Roles & Permissions](#10-roles--permissions)

---

## 1. Auth

### `POST /auth/login`
**Public** — No auth required.

**Request:**
```json
{ "email": "string", "password": "string" }
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUz...",
  "user": {
    "id": "uuid",
    "email": "magdalena.potarniche@nest.local",
    "firstName": "Magdalena",
    "lastName": "Potârniche",
    "role": "ADMIN",
    "isVerified": true,
    "blockId": "uuid-of-block"
  },
  "permissions": ["delete_any_post", "manage_users", ...]
}
```
**Errors:** `401` Invalid credentials

---

### `POST /auth/register`
**Public** — No auth required.

**Request:**
```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "apartmentNumber": "string"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUz...",
  "user": {
    "id": "uuid",
    "email": "new.user@nest.local",
    "firstName": "Ion",
    "lastName": "Popescu",
    "role": "RESIDENT",
    "isVerified": false,
    "blockId": null
  },
  "permissions": []
}
```
**Errors:** `409` Email already registered

---

### `POST /auth/join-block`
**Protected** — Requires auth (does NOT require verified).

**Request:**
```json
{ "blockCode": "NEST-BLOC-A1" }
```

**Response (200):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "blockId": "uuid",
  "status": "PENDING",
  "createdAt": "2026-04-20T..."
}
```
**Errors:** `409` Invalid block code or request already submitted

---

### `GET /auth/permissions`
**Protected** — Returns role and permissions for authenticated user.

**Response (200):**
```json
{
  "role": "ADMIN",
  "permissions": [
    "delete_any_post",
    "delete_any_event",
    "delete_any_resource",
    "delete_any_announcement",
    "update_any_post",
    "update_any_event",
    "update_any_resource",
    "manage_users",
    "manage_blocks"
  ]
}
```
For RESIDENT role, `permissions` is an empty array `[]`.

---

## 2. Users

All endpoints require **verified** auth.

### `GET /users/me`
Returns the full profile of the authenticated user.

**Response (200):**
```json
{
  "id": "uuid",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "apartmentNumber": "string",
  "phoneNumber": "string | null",
  "profileImage": "string | null",
  "headline": "string | null",
  "about": "string | null",
  "preferences": "{\"theme\":\"light\",\"isPhonePublic\":false}",
  "role": "RESIDENT",
  "isVerified": true,
  "blockId": "uuid",
  "block": { "id": "uuid", "name": "Bloc A1", "address": "Str. Exemplu Nr. 10" },
  "createdAt": "2026-04-20T..."
}
```

### `PUT /users/me`
Update the authenticated user's profile.

**Request (all fields optional):**
```json
{
  "firstName": "string",
  "lastName": "string",
  "phoneNumber": "string",
  "headline": "string",
  "about": "string",
  "profileImage": "string"
}
```
**Response (200):** Updated user object.

### `PUT /users/me/preferences`
**Request:**
```json
{ "theme": "dark", "isPhonePublic": true }
```
**Response (200):** `{ "id": "uuid", "preferences": "{...}" }`

### `GET /users/:id`
Returns another user's public profile (phone hidden unless `isPhonePublic` is true).

**Response (200):** Public user object.

---

## 3. Admin

All endpoints require **ADMIN role** auth.

### `GET /admin/pending-users`
List all pending join requests for blocks administered by the authenticated admin.

**Response (200):**
```json
[
  {
    "id": "join-request-uuid",
    "status": "PENDING",
    "user": {
      "id": "uuid",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "apartmentNumber": "string",
      "createdAt": "date"
    },
    "block": { "id": "uuid", "name": "Bloc A1" }
  }
]
```

### `POST /admin/users/:userId/approve`
**Request:**
```json
{ "joinRequestId": "join-request-uuid" }
```
**Response (200):** User object with `isVerified: true` and `blockId` set.

### `POST /admin/users/:userId/reject`
**Request:**
```json
{ "joinRequestId": "join-request-uuid" }
```
**Response (200):** Rejected join request object.

### `DELETE /admin/users/:userId`
Removes a user from the block (sets `isVerified: false`, `blockId: null`).

**Response (200):** Updated user object.

---

## 4. Feed

All endpoints require **verified** auth.

### `GET /feed`
**Query params:** `page`, `limit`, `search`, `sortBy`, `sortOrder`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "content": "Buna dimineata tuturor vecinilor!",
      "imageUrl": null,
      "authorId": "uuid",
      "author": { "id": "uuid", "firstName": "Magdalena", "lastName": "Potârniche", "profileImage": null },
      "createdAt": "2026-04-20T...",
      "updatedAt": "2026-04-20T..."
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20
}
```

### `GET /feed/:id`
**Response (200):** Single post object with author.

### `POST /feed`
**Request:**
```json
{ "content": "string", "imageUrl": "string (optional)" }
```
**Response (201):** Created post object.
**Errors:** `429` Daily post limit exceeded.

### `PUT /feed/:id`
**Request:** `{ "content": "string" }`
**Response (200):** Updated post. Owner or admin only.

### `DELETE /feed/:id`
**Response (204):** No content. Owner or admin only.

---

## 5. Events

All endpoints require **verified** auth.

### `GET /events`
**Query params:** `page`, `limit`, `search`, `sortBy`, `sortOrder`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Asociatia de Locatari Meeting",
      "description": "string",
      "location": "Scara A - parter",
      "type": "MEETING",
      "startTime": "date-time",
      "endTime": "date-time",
      "maxParticipants": 50,
      "visibility": "ALL",
      "creator": { "firstName": "string", "lastName": "string" },
      "attendees": [{ "userId": "uuid", "eventId": "uuid", "status": "JOINED" }]
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 20
}
```

### `GET /events/:id`
**Response (200):** Single event object with attendees.

### `POST /events`
**Request:**
```json
{
  "title": "string",
  "description": "string",
  "location": "string",
  "type": "MEETING | SOCIAL | MAINTENANCE | OTHER",
  "startTime": "ISO date-time",
  "endTime": "ISO date-time",
  "maxParticipants": "integer (optional)",
  "visibility": "ALL | BUILDING | FLOOR (optional, defaults ALL)"
}
```
**Response (201):** Created event.

### `POST /events/:id/join`
**Response (200):** EventAttendee record.
**Errors:** `409` Already joined or event full.

### `POST /events/:id/leave`
**Response (200):** Deleted attendance record.
**Errors:** `404` Not attending this event.

### `PUT /events/:id`
**Request:** `{ "title": "string", "description": "string" }`
**Response (200):** Updated event. Owner or admin only.

### `DELETE /events/:id`
**Response (204):** No content. Owner or admin only.

---

## 6. Shared Shed

All endpoints require **verified** auth.

### `GET /shed`
**Query params:** `page`, `limit`, `search`, `sortBy`, `sortOrder`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Bormasina",
      "description": "Masina de gaurit profesionala",
      "type": "TOOL",
      "ownerId": "uuid | null",
      "owner": { "firstName": "string", "lastName": "string" }
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 20
}
```

### `GET /shed/:id`
**Response (200):** Resource with reservations.

### `POST /shed`
**Request:**
```json
{
  "name": "string",
  "description": "string",
  "type": "TOOL | BOOK | OTHER",
  "isCommunityOwned": "boolean (optional, if true => ownerId is null)"
}
```
**Response (201):** Created resource.

### `POST /shed/:id/reserve`
**Request:**
```json
{ "startTime": "ISO date-time", "endTime": "ISO date-time" }
```
**Response (200):** Reservation with status `APPROVED`.
**Errors:** `409` Resource engaged or on cooldown.

### `POST /shed/:id/return`
Marks the current active reservation as `RETURNED`.

**Response (200):** Reservation with status `RETURNED`.
**Errors:** `404` No active reservation found.

### `PUT /shed/:id`
**Request:** `{ "name": "string", "description": "string" }`
**Response (200):** Updated resource. Owner or admin only.

### `DELETE /shed/:id`
**Response (204):** No content. Owner or admin only.

---

## 7. Parking

All endpoints require **verified** auth.

### `GET /parking`
**Query params:** `page`, `limit`, `search`, `sortBy`, `sortOrder`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "parkingSlotId": "uuid",
      "parkingSlot": { "id": "uuid", "identifier": "SLOT-A12" },
      "publisher": { "firstName": "string", "lastName": "string", "apartmentNumber": "string" },
      "availableFrom": "date-time",
      "availableTo": "date-time",
      "applications": [{ "id": "uuid", "applicantId": "uuid", "status": "PENDING" }]
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 20
}
```

### `GET /parking/slots`
**Response (200):** Array of parking slots with owner info.

### `POST /parking/slots`
**Request:** `{ "identifier": "SLOT-B5" }`
**Response (201):** Created slot.
**Errors:** `409` Identifier already exists.

### `GET /parking/:id`
**Response (200):** Announcement with applications.

### `POST /parking`
**Request:**
```json
{ "parkingSlotId": "uuid", "availableFrom": "ISO date-time", "availableTo": "ISO date-time" }
```
**Response (201):** Created announcement.

### `POST /parking/:id/apply`
**Response (200):** Application record.
**Errors:** `409` Already applied or slot claimed.

### `POST /parking/applications/:applicationId/approve`
Only the announcement publisher can approve. Approving auto-rejects all other applications.

**Response (200):** Approved application record.
**Errors:** `403` Not the publisher. `409` Slot already claimed.

### `DELETE /parking/:id`
**Response (204):** No content. Publisher or admin only.

---

## 8. Pagination

All list endpoints (`GET /feed`, `GET /events`, `GET /shed`, `GET /parking`) support:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page |
| `search` | string | - | Search keyword |
| `sortBy` | string | varies | Field to sort by |
| `sortOrder` | string | varies | `asc` or `desc` |

**Paginated response format:**
```json
{
  "data": [...],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

---

## 9. Error Handling

All errors return a consistent format:
```json
{ "error": "Human-readable error message" }
```

| Status | Meaning |
|--------|---------|
| 400 | Bad request — missing or invalid fields |
| 401 | Unauthorized — invalid or missing token |
| 403 | Forbidden — insufficient permissions or not verified |
| 404 | Not found |
| 409 | Conflict — duplicate resource or business constraint violation |
| 429 | Too many requests — rate limit or business limit exceeded |
| 500 | Internal server error |

---

## 10. Roles & Permissions

### Roles
| Role | Description |
|------|-------------|
| `RESIDENT` | Standard user — can CRUD own resources |
| `ADMIN` | Block administrator — can manage any resource + approve users |

### Permission Strings
Returned in login response and `GET /auth/permissions`. Use these to conditionally render UI:

| Permission | Description |
|------------|-------------|
| `delete_any_post` | Delete any user's feed post |
| `delete_any_event` | Delete any user's event |
| `delete_any_resource` | Delete any shed resource |
| `delete_any_announcement` | Delete any parking announcement |
| `update_any_post` | Edit any user's feed post |
| `update_any_event` | Edit any user's event |
| `update_any_resource` | Edit any shed resource |
| `manage_users` | Approve/reject/remove users |
| `manage_blocks` | Create/edit blocks |

### Registration Flow
1. `POST /auth/register` → account created with `isVerified: false`
2. Frontend shows block-code input page
3. `POST /auth/join-block` → join request created (PENDING)
4. Block admin sees request via `GET /admin/pending-users`
5. Admin calls `POST /admin/users/:userId/approve` → user becomes verified
6. User can now access all protected endpoints

### Seed Data
| Email | Password | Role |
|-------|----------|------|
| magdalena.potarniche@nest.local | parola123 | RESIDENT |
| relizeanu.eusebiu@nest.local | parola123 | RESIDENT |
| marius.scrum@nest.local | parola123 | ADMIN |
| valeria.trotineta@nest.local | parola123 | RESIDENT |
| dorel.mesteru@nest.local | parola123 | RESIDENT |

**Block code:** `NEST-BLOC-A1` (admin: marius.scrum@nest.local)
