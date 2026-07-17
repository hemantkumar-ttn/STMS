# API Contract

Base URL: `http://localhost:5000/api`

All responses use JSON. Errors return `{ "success": false, "message": "..." }`.

---

## Health Check

### `GET /health`

**Response 200:**
```json
{
  "success": true,
  "message": "STMS API is running"
}
```

---

## Tickets

### `GET /tickets`

List tickets with optional search, status filter, and pagination.

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `search` | string | No | Keyword search on title/description |
| `status` | string | No | Filter by status. Omit or empty = all |
| `page` | integer | No | Page number (default: 1) |
| `limit` | integer | No | Items per page (default: 20, max: 100) |

**Valid status values:** `Open`, `In Progress`, `Resolved`, `Closed`, `Cancelled`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6a5a0e88eb368c15c108d021",
      "title": "Cannot login to dashboard",
      "description": "User reports being unable to login...",
      "priority": "High",
      "status": "Open",
      "assignedTo": {
        "_id": "6a5a0e88eb368c15c108d022",
        "name": "Bob Agent",
        "email": "bob@stms.com",
        "role": "agent"
      },
      "createdBy": {
        "_id": "6a5a0e88eb368c15c108d024",
        "name": "Dave User",
        "email": "dave@stms.com",
        "role": "user"
      },
      "createdAt": "2026-07-17T10:00:00.000Z",
      "updatedAt": "2026-07-17T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 6,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

**Errors:** 400 (invalid query params)

---

### `GET /tickets/:id`

Get a single ticket with its comments.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "ticket": { /* ticket object */ },
    "comments": [
      {
        "_id": "...",
        "ticketId": "...",
        "message": "Checking authentication service logs.",
        "createdBy": {
          "_id": "...",
          "name": "Bob Agent",
          "email": "bob@stms.com",
          "role": "agent"
        },
        "createdAt": "2026-07-17T10:30:00.000Z"
      }
    ]
  }
}
```

**Errors:** 400 (invalid ID), 404 (not found)

---

### `POST /tickets`

Create a new ticket.

**Request Body:**
```json
{
  "title": "Cannot login to dashboard",
  "description": "Detailed description of the issue",
  "priority": "High",
  "assignedTo": "6a5a0e88eb368c15c108d022",
  "createdBy": "6a5a0e88eb368c15c108d024"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | Yes | Max 200 chars |
| `description` | string | Yes | Max 5000 chars |
| `priority` | string | No | `Low`, `Medium`, `High`, `Critical`. Default: `Medium` |
| `status` | string | No | Default: `Open` |
| `assignedTo` | ObjectId | No | Must reference existing user |
| `createdBy` | ObjectId | Yes | Must reference existing user |

**Response 201:** Created ticket object (populated).

**Errors:** 400 (validation), 404 (user not found)

---

### `PUT /tickets/:id`

Update ticket fields. **Does not change status.**

**Request Body:** (all fields optional)
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "Critical",
  "assignedTo": "6a5a0e88eb368c15c108d023"
}
```

**Response 200:** Updated ticket object (populated).

**Errors:**
- 400 — validation failure or attempt to change status
- 404 — ticket or assignee not found

---

### `PATCH /tickets/:id/status`

Change ticket status with workflow enforcement.

**Request Body:**
```json
{
  "status": "In Progress"
}
```

**Response 200:** Updated ticket object (populated).

**Errors:**
- 400 — invalid transition (see status rules below)
- 404 — ticket not found

**Status transition rules:**

| Current Status | Allowed Next Statuses |
|---------------|----------------------|
| Open | In Progress, Cancelled |
| In Progress | Resolved, Cancelled |
| Resolved | Closed |
| Closed | _(none — terminal)_ |
| Cancelled | _(none — terminal)_ |

**Error example (400):**
```json
{
  "success": false,
  "message": "Invalid status transition from \"Open\" to \"Resolved\". Allowed: In Progress, Cancelled."
}
```

---

### `DELETE /tickets/:id`

Delete a ticket and all associated comments.

**Response 200:**
```json
{
  "success": true,
  "message": "Ticket deleted successfully"
}
```

**Errors:** 404 (not found)

---

## Comments

### `GET /tickets/:ticketId/comments`

List comments for a ticket (chronological).

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "ticketId": "...",
      "message": "Comment text",
      "createdBy": { "_id": "...", "name": "...", "email": "...", "role": "..." },
      "createdAt": "2026-07-17T10:30:00.000Z"
    }
  ]
}
```

**Errors:** 400 (invalid ID), 404 (ticket not found)

---

### `POST /tickets/:ticketId/comments`

Add a comment to a ticket.

**Request Body:**
```json
{
  "message": "This is a follow-up comment",
  "createdBy": "6a5a0e88eb368c15c108d022"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `message` | string | Yes | Max 2000 chars |
| `createdBy` | ObjectId | Yes | Must reference existing user |

**Response 201:** Created comment object (populated).

**Errors:** 400 (validation), 404 (ticket or user not found)

---

## Users

### `GET /users`

List all users (seed data).

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6a5a0e88eb368c15c108d021",
      "name": "Alice Admin",
      "email": "alice@stms.com",
      "role": "admin"
    }
  ]
}
```

---

### `GET /users/:id`

Get a single user.

**Response 200:** User object.

**Errors:** 400 (invalid ID), 404 (not found)

---

## HTTP Status Code Summary

| Code | Usage |
|------|-------|
| 200 | Successful GET, PUT, PATCH, DELETE |
| 201 | Successful POST (create) |
| 400 | Validation error, invalid transition, bad input |
| 404 | Resource not found |
| 500 | Unhandled server error |

## Swagger

Interactive API documentation: `GET /api/docs`
