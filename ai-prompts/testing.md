# Testing Prompts — STMS

Use these prompts when writing, running, or extending tests for STMS.

---

## Project Context

```
STMS testing stack:
- Jest + Supertest + mongodb-memory-server (server/tests/)
- In-memory MongoDB — no external DB required for tests
- NODE_ENV=test
- Run: cd server && npm test
- 20 integration tests in server/tests/tickets.test.js

Frontend: manual testing for MVP; React Testing Library is future work.

Reference: test-strategy.md, acceptance-criteria.md
```

---

## Write Integration Test

```
Write a Jest integration test for STMS: [SCENARIO].

Setup pattern (server/tests/setup.js):
- beforeAll: start mongodb-memory-server, connect Mongoose
- afterEach: clear all collections
- afterAll: stop memory server

Test pattern:
- beforeEach: create User and Ticket via Mongoose models
- Use supertest(app) for HTTP requests
- Assert HTTP status and response body (success, message, data)
- Do not mock database or HTTP layer

Place test in server/tests/tickets.test.js or new file matching **/tests/**/*.test.js
```

---

## Status Transition Test Matrix

```
Generate integration tests for STMS status transitions.

Valid (expect 200):
- Open → In Progress
- Open → Cancelled
- In Progress → Resolved
- In Progress → Cancelled
- Resolved → Closed
- Same status (no-op)

Invalid (expect 400, success: false):
- Open → Resolved (skip In Progress)
- Open → Closed
- In Progress → Open
- Resolved → In Progress
- Closed → any (terminal state message)
- Cancelled → any (terminal state message)

Use PATCH /api/tickets/:id/status with { status: "..." }.
Assert message matches /Invalid status transition/ or /terminal state/ where applicable.
```

---

## CRUD Test Coverage

```
Write integration tests for STMS ticket CRUD:

1. POST /api/tickets — 201, status defaults to Open, priority defaults to Medium
2. GET /api/tickets?status=Open — all results have status Open
3. GET /api/tickets?status= — 200, returns all (empty filter)
4. GET /api/tickets?search=keyword — text search returns matches
5. GET /api/tickets/:id — 404 for fake ID, 400 for invalid ObjectId
6. DELETE /api/tickets/:id — 200, ticket and comments removed from DB

Each test creates its own data; no dependency on seed script.
```

---

## Comment Test Coverage

```
Write integration tests for STMS comments:

1. POST /api/tickets/:ticketId/comments — 201, returns message and createdBy
2. POST /api/tickets/:fakeId/comments — 404
3. DELETE ticket — verify Comment.deleteMany removed associated comments

Use supertest; assert response shape matches api-contract.md.
```

---

## Regression Test for Bug

```
A bug was reported in STMS: [DESCRIPTION]

Write a failing-then-passing integration test that:
1. Reproduces the exact scenario (e.g., empty status filter, invalid transition via PUT)
2. Asserts the expected HTTP status and message
3. Lives in server/tests/ alongside related tests

Known fixed regressions to model after:
- Empty status query param (checkFalsy + cleanParams)
- Status change blocked on PUT endpoint
```

---

## Manual Frontend Test Checklist

```
Generate a manual test checklist for [SCREEN/FLOW] in STMS.

Base checklist from test-strategy.md:

Dashboard:
- Tickets load, search works, status filter works, "All Statuses" shows all, empty state, navigation to details

Create/Edit Ticket:
- Validation, redirect after create, pre-filled edit form, error on API failure

Ticket Details:
- Fields displayed, only valid status buttons shown, comments add/list, delete returns to dashboard

Error scenarios:
- Backend down → proxy/alert error
- Invalid ticket ID in URL → error message

Format as checkboxes a tester can mark pass/fail.
```

---

## Test Run and CI

```
Verify STMS test health:

1. cd server && npm test — all 20 tests pass
2. cd client && npm run build — production build succeeds

If mongodb-memory-server cleanup fails:
- Check server/tests/setup.js: mongoServer.stop({ doCleanup: true, force: true })

Future CI (GitHub Actions):
- Node 20, npm ci, server tests, client build
- No external MongoDB service needed for tests
```

---

## Test Quality Review

```
Review STMS tests in server/tests/ for quality.

Check against test-strategy.md principles:
1. Test behavior (HTTP status + body), not implementation details
2. One scenario focus per test
3. Descriptive test names (e.g., "Open -> Resolved (skip In Progress)")
4. No inter-test dependencies
5. Business rules (status transitions) have highest coverage

Report gaps: user endpoints, pagination edge cases, validator unit tests, frontend RTL.
```
