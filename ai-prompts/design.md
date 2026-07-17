# Design Prompts — STMS

Use these prompts when making architecture, API, data model, or UI design decisions for STMS.

---

## Project Context

```
STMS uses a three-tier MERN architecture:
- Client: React 18 + Vite + Tailwind, React Router, Axios, Context API + useReducer
- Server: Express, Mongoose, express-validator, centralized error handling
- Data: MongoDB (User, Ticket, Comment models)

Design docs: design-notes.md, data-model.md, api-contract.md, ui-flow.md.
See design-notes.md for existing decisions (dedicated status endpoint, no auth MVP, text index search, cascade delete).
```

---

## Architecture Review

```
Review the proposed design for [FEATURE] in STMS against our architecture in design-notes.md.

Evaluate:
1. Layer placement (config, routes, controllers, middleware, models, utils, seed)
2. Whether business logic belongs in utils/ (pure) vs. controllers (orchestration)
3. API response format consistency ({ success, data/message, pagination })
4. Frontend state: TicketContext vs. local component state
5. Duplication between server/src/utils/statusTransitions.js and client/src/utils/constants.js

Output: recommendation, trade-offs table, and files to create/modify.
```

---

## API Endpoint Design

```
Design a new API endpoint for STMS: [DESCRIPTION].

Constraints:
- Follow patterns in server/src/routes/, server/src/controllers/, server/src/middleware/validators.js
- Use express-validator + shared validate middleware
- Controllers use async/await and next(error) — no inline res.status() for errors
- AppError for operational errors; global errorHandler normalizes Mongoose errors
- Status workflow: only PATCH /api/tickets/:id/status changes status
- Populate createdBy and assignedTo in ticket responses

Provide: OpenAPI-style spec, validator rules, controller pseudocode, and example curl commands.
```

---

## Data Model Design

```
Design or extend the MongoDB schema for [ENTITY/CHANGE] in STMS.

Reference data-model.md and existing models in server/src/models/:
- User: name, email, role (admin | agent | user)
- Ticket: title, description, priority, status, createdBy, assignedTo, text index on title+description
- Comment: ticketId, message, createdBy, timestamps

Output:
1. Mongoose schema with field types, enums, refs, indexes
2. Validation rules (schema-level + express-validator)
3. Impact on seed script (server/src/seed/)
4. Migration/seed strategy for existing data
```

---

## Status Workflow Design

```
I need to change or extend the ticket status workflow in STMS.

Current rules (server/src/utils/statusTransitions.js):
- Open → In Progress, Cancelled
- In Progress → Resolved, Cancelled
- Resolved → Closed
- Closed, Cancelled → terminal (no transitions)

Design the change considering:
1. Single source of truth in statusTransitions.js
2. Frontend button visibility in client/src/utils/constants.js
3. Dedicated PATCH /status endpoint (not PUT)
4. Error messages for invalid transitions and terminal states
5. Integration test matrix (valid + invalid transitions in server/tests/tickets.test.js)

Provide updated transition map, error message templates, and test case list.
```

---

## Frontend Component Design

```
Design a React component for STMS: [COMPONENT NAME].

Conventions:
- Presentational components in client/src/components/
- Pages in client/src/pages/ (route-level)
- Tailwind CSS for styling; match existing Badge, Alert, Spinner patterns
- Props-driven; API calls via TicketContext or api.js, not inside dumb components
- Handle loading (Spinner), empty state, and error (Alert) consistently

Output: component responsibility, props interface, parent/child relationships, and Tailwind layout notes.
```

---

## Error Handling Design

```
Design error handling for [SCENARIO] in STMS.

Server patterns:
- AppError class with statusCode and isOperational
- errorHandler middleware: ValidationError → 400, CastError → 400, duplicate key → 400
- Response: { success: false, message: "..." }; stack only in NODE_ENV=development

Client patterns:
- Axios interceptor in client/src/services/api.js normalizes errors for UI
- TicketContext stores success/error messages for Alert component

Provide: error types, HTTP status codes, user-facing messages, and where to throw/catch.
```

---

## Design Trade-off Analysis

```
Compare two approaches for [DECISION] in STMS:

Option A: [DESCRIPTION]
Option B: [DESCRIPTION]

Use the trade-off format from design-notes.md (Benefit | Cost).
Consider MVP scope, testability, alignment with existing patterns, and post-MVP extensibility (auth, real-time, CI).
Recommend one option with rationale.
```
