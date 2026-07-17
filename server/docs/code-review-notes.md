# Code Review Notes

## Overview

Review of the STMS server codebase covering architecture, security, validation, error handling, and test coverage.

## Strengths

### 1. Clean Separation of Concerns

- **Routes** — HTTP mapping and Swagger annotations only
- **Controllers** — business orchestration, thin handlers
- **Models** — Mongoose schemas with field-level validation
- **Middleware** — cross-cutting validation and error handling
- **Utils** — pure status transition logic, easily testable

### 2. Status Workflow Design

`src/utils/statusTransitions.js` is a single source of truth:

```javascript
const VALID_TRANSITIONS = {
  Open: ['In Progress', 'Cancelled'],
  'In Progress': ['Resolved', 'Cancelled'],
  Resolved: ['Closed'],
  Closed: [],
  Cancelled: [],
};
```

- Dedicated `PATCH /status` endpoint prevents accidental status changes via PUT
- Descriptive error messages for invalid transitions
- 12 integration tests cover all valid and invalid paths

### 3. Centralized Error Handling

`errorHandler.js` normalizes:
- Custom `AppError` (operational errors)
- Mongoose `ValidationError` → 400
- Mongoose `CastError` → 400
- Duplicate key (`11000`) → 400

Consistent `{ success: false, message }` response format across all endpoints.

### 4. Input Validation

All write endpoints use express-validator with a shared `validate` middleware. Query params use `checkFalsy` for optional empty values.

### 5. Test Quality

- In-memory MongoDB — no external dependencies for CI
- Per-test data setup in `beforeEach`
- Tests assert HTTP status and response body, not internals

---

## Findings

### Medium Priority

| # | Finding | Location | Recommendation |
|---|---------|----------|----------------|
| M1 | No authentication/authorization | All routes | Acceptable for MVP; add JWT middleware before production |
| M2 | `createdBy` accepted from request body | `ticketController.js` | Trust boundary issue — should come from auth token |
| M3 | No rate limiting | `app.js` | Add `express-rate-limit` for production |
| M4 | CORS allows all origins | `app.js` | Restrict to frontend origin in production |
| M5 | User endpoints untested | `tests/` | Add basic GET tests for `/api/users` |

### Low Priority

| # | Finding | Location | Recommendation |
|---|---------|----------|----------------|
| L1 | No request logging (morgan) | `app.js` | Add for observability |
| L2 | Pagination lacks sort param | `ticketController.js` | Hardcoded `updatedAt: -1` is fine for MVP |
| L3 | Comment model has no index on `ticketId` | `Comment.js` | Add index for faster lookups at scale |
| L4 | Seed script uses `process.exit(0)` | `seed/seed.js` | Acceptable for CLI script |
| L5 | Jest `--forceExit` masks open handles | `package.json` | Monitor; fix underlying handle leaks if needed |

### Positive Patterns to Maintain

- `next(error)` pattern in controllers — no inline `res.status()` for errors
- Population of references in responses — good API ergonomics
- Cascade delete of comments on ticket deletion
- Text index for search defined in schema

---

## Security Review

| Check | Status | Notes |
|-------|--------|-------|
| No hardcoded secrets | Pass | Uses `.env` |
| Input validation on writes | Pass | express-validator on all endpoints |
| NoSQL injection | Pass | Mongoose parameterized queries |
| Error stack in production | Pass | Only in `development` NODE_ENV |
| Auth on endpoints | N/A | Out of scope for MVP |
| Helmet security headers | Missing | Add for production |

---

## Code Style

- Consistent async/await in controllers
- JSDoc comments on key functions
- File naming follows convention (`ticketController.js`, `ticketRoutes.js`)
- No unused dependencies in `package.json`

---

## Test Coverage Assessment

| Module | Covered | Notes |
|--------|---------|-------|
| Status transitions | Yes | 12 tests |
| Ticket CRUD | Yes | 6 tests |
| Comments | Yes | 2 tests |
| Users | No | Read-only, low risk |
| Validators (edge cases) | Partial | Via integration tests only |
| Error handler | Partial | Tested indirectly |

**Overall:** Adequate for MVP. Status workflow — the most critical business rule — is thoroughly tested.

---

## Verdict

**Approve with minor recommendations.** The server is well-structured, follows Express best practices, and enforces business rules correctly. Main gap is authentication, which is documented as out of scope.
