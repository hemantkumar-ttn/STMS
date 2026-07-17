# Implementation Prompts — STMS

Use these prompts when writing or extending code in the STMS codebase.

---

## Project Context

```
Implement changes in STMS following existing conventions:

server/
  src/config/       — DB, Swagger
  src/controllers/  — thin handlers, next(error)
  src/middleware/   — validators.js, errorHandler.js
  src/models/       — Mongoose schemas only
  src/routes/       — routes + Swagger JSDoc
  src/utils/        — pure logic (statusTransitions.js)
  src/seed/         — seed script
  tests/            — Jest integration tests

client/
  src/components/   — reusable UI
  src/context/      — TicketContext (useReducer)
  src/pages/        — route pages
  src/services/     — api.js (Axios)
  src/utils/        — constants.js (mirror backend status rules)

Rules:
- Minimal diff; no new dependencies unless necessary
- Status changes only via PATCH /api/tickets/:id/status
- PUT must reject status field changes
- cleanParams() strips empty query params before API calls
- No authentication — createdBy from request body / default agent user
```

---

## Backend Feature Implementation

```
Implement [FEATURE] on the STMS backend.

Steps:
1. Update Mongoose model in server/src/models/ if needed
2. Add or extend controller in server/src/controllers/
3. Add express-validator rules in server/src/middleware/validators.js (use checkFalsy for optional query params)
4. Register route in server/src/routes/ with Swagger JSDoc
5. Add integration tests in server/tests/
6. Run: cd server && npm test

Follow existing patterns:
- async/await in controllers
- next(error) for all errors
- Populate createdBy and assignedTo on ticket responses
- Cascade delete comments when deleting a ticket (Comment.deleteMany)
```

---

## Status Transition Implementation

```
Implement or fix status transition logic in STMS.

Files to coordinate:
- server/src/utils/statusTransitions.js — VALID_TRANSITIONS, isValidTransition(), getAllowedTransitions()
- server/src/controllers/ticketController.js — changeStatus handler
- server/src/middleware/validators.js — status enum validation
- client/src/utils/constants.js — ALLOWED_TRANSITIONS for UI buttons
- server/tests/tickets.test.js — 12 transition tests

Valid transitions:
  Open → In Progress, Cancelled
  In Progress → Resolved, Cancelled
  Resolved → Closed

Return HTTP 400 with descriptive message for invalid transitions and terminal states.
Same-status change is a no-op (200).
```

---

## Frontend Page Implementation

```
Implement [PAGE/FEATURE] in the STMS React frontend.

Conventions:
- React 18 functional components
- React Router for navigation (see existing pages in client/src/pages/)
- TicketContext for global ticket state, filters, loading, messages
- API calls through client/src/services/api.js only
- Tailwind CSS; reuse Layout, Badge, Alert, Spinner, TicketForm, TicketFilters

UI states required:
- Loading: Spinner
- Empty: friendly message when no tickets match
- Success: Alert banner after create/update/delete
- Error: Alert with message from API interceptor

Vite dev proxy: /api → http://localhost:5000
```

---

## API Service Layer

```
Add or update API methods in client/src/services/api.js for STMS.

Patterns:
- baseURL: '/api'
- Response interceptor: extract error message from { success: false, message }
- cleanParams(obj): remove null, undefined, and empty-string values before GET requests
- Export named functions: getTickets, getTicket, createTicket, updateTicket, changeStatus, deleteTicket, getComments, addComment, getUsers

Do not duplicate Axios instances or bypass the interceptor.
```

---

## Validation Implementation

```
Add input validation for [ENDPOINT] in STMS.

Server: express-validator in server/src/middleware/validators.js
- Body validators for POST/PUT/PATCH
- Param validators for :id (MongoDB ObjectId)
- Query validators with .optional({ checkFalsy: true }) for status, search, page, limit

Valid enums:
- status: Open, In Progress, Resolved, Closed, Cancelled
- priority: Low, Medium, High, Critical
- role: admin, agent, user

Chain validate middleware after route validators.
```

---

## Seed Data Update

```
Update the STMS seed script at server/src/seed/seed.js.

Current seed: 5 users, 6 tickets, 4 comments.
- Clear collections before insert
- Use realistic titles/descriptions for text search demos
- Cover multiple statuses for filter UI
- Log created IDs for manual testing

Run: cd server && npm run seed (requires MongoDB running)
```

---

## Safe Refactor Prompt

```
Refactor [MODULE] in STMS with minimal behavior change.

Constraints:
- Do not change API contract (api-contract.md)
- Do not change status transition rules without updating tests
- Keep folder structure and naming conventions
- Run cd server && npm test after server changes
- Run cd client && npm run build after client changes
- Summarize what changed, why, and which files were modified
```
