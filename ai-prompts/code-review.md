# Code Review Prompts — STMS

Use these prompts when reviewing pull requests or local changes in STMS.

---

## Project Context

```
Review STMS code against:
- design-notes.md (architecture, conventions)
- api-contract.md (API shapes)
- acceptance-criteria.md (behavior)
- server/docs/code-review-notes.md (prior review findings)

Stack: MERN, express-validator, Jest integration tests, React Context + useReducer.
Critical rule: status workflow enforced server-side in statusTransitions.js.
MVP: no authentication; createdBy from request body.
```

---

## Full PR Review

```
Review this STMS pull request for [FEATURE/FIX].

Check:

Architecture
- [ ] Business logic in utils/ not controllers
- [ ] Thin controllers using next(error)
- [ ] Validators on all write endpoints
- [ ] No status change via PUT

API Contract
- [ ] Response format { success, data/message, pagination }
- [ ] Status changes only on PATCH /api/tickets/:id/status
- [ ] Populated refs on ticket responses

Security (MVP scope)
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] No eval or unsafe patterns
- [ ] Flag: createdBy from body (known MVP trust boundary)

Tests
- [ ] Integration tests for new behavior
- [ ] Status transition tests if workflow touched
- [ ] cd server && npm test passes

Frontend
- [ ] API calls only via api.js
- [ ] cleanParams on filtered GETs
- [ ] Loading, empty, error UI states
- [ ] Status buttons match backend rules

Output: Approve / Request changes, with prioritized findings (Critical, Medium, Low).
```

---

## Backend-Only Review

```
Review STMS server changes in:
[LIST FILES or PASTE DIFF]

Focus:
1. server/src/controllers/ — async/await, next(error), no duplicated response formatting
2. server/src/middleware/validators.js — checkFalsy on optional query params
3. server/src/utils/statusTransitions.js — single source of truth
4. server/src/models/ — schema validation, indexes, enums
5. server/src/middleware/errorHandler.js — consistent error messages
6. server/tests/ — behavior assertions, isolated test data

Reference prior findings (code-review-notes.md):
- M1: No auth (acceptable MVP)
- M2: createdBy trust boundary
- M5: User endpoints untested
```

---

## Frontend-Only Review

```
Review STMS client changes in:
[LIST FILES or PASTE DIFF]

Focus:
1. client/src/services/api.js — interceptor, cleanParams, no raw fetch
2. client/src/context/TicketContext.jsx — reducer actions, loading/error state
3. client/src/pages/ — route logic, navigation after mutations
4. client/src/components/ — presentational, reusable, Tailwind consistency
5. client/src/utils/constants.js — sync with backend status rules

Check for:
- Direct axios calls bypassing api.js
- Missing error/loading UI
- Status buttons for invalid transitions
- Hardcoded API URLs (should use /api proxy)
```

---

## Security Review (MVP)

```
Security review STMS changes for production readiness.

Pass criteria (MVP):
- No secrets in code or commits
- express-validator on inputs
- Mongoose queries (no raw user objects in queries)
- Stack traces not exposed in production

Known gaps (document, don't block MVP):
- No JWT/auth
- CORS allows all origins
- No rate limiting
- No Helmet headers
- createdBy accepted from client

Recommend post-MVP hardening steps for any new endpoints.
```

---

## Test Coverage Review

```
Review test coverage for STMS change: [DESCRIPTION].

Required for status/workflow changes:
- All 6 valid transitions + same-status no-op
- All 6 invalid transitions including terminal states

Required for CRUD changes:
- Happy path + 404/400 cases
- Empty filter regression if query params involved

Gaps acceptable for MVP: user GET endpoints, pagination boundaries, frontend RTL.

Verdict: adequate / insufficient with specific tests to add.
```

---

## Minimal Diff Review

```
Review whether this STMS change is minimal and focused.

Questions:
1. Does it solve the stated problem without unrelated refactors?
2. Are new dependencies justified?
3. Does it follow existing naming and folder structure?
4. Could any logic reuse statusTransitions.js, errorHandler, or TicketForm?

Suggest smaller alternative if scope is too broad.
```

---

## Positive Patterns Checklist

```
Confirm these STMS patterns are preserved in the changes:

- [ ] next(error) in controllers
- [ ] Dedicated PATCH /status endpoint
- [ ] Cascade delete comments on ticket delete
- [ ] Text index for search in Ticket schema
- [ ] Swagger JSDoc on new routes
- [ ] TicketContext centralizes API calls
- [ ] Descriptive invalid transition error messages
```
