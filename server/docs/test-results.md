# Test Results

## Summary

| Metric | Value |
|--------|-------|
| Test Suites | 1 passed |
| Tests | 20 passed, 0 failed |
| Snapshots | 0 |
| Duration | ~1.4s |
| Environment | `NODE_ENV=test` |
| Database | mongodb-memory-server (in-memory) |

**Status: ALL PASSING**

## Command

```bash
cd server && npm test
```

## Test Suite: `tests/tickets.test.js`

### Valid Status Transitions (6/6 passed)

| Test | Status | Time |
|------|--------|------|
| Open → In Progress | PASS | ~212ms |
| Open → Cancelled | PASS | ~10ms |
| In Progress → Resolved | PASS | ~10ms |
| In Progress → Cancelled | PASS | ~9ms |
| Resolved → Closed | PASS | ~10ms |
| Same status is a no-op (allowed) | PASS | ~6ms |

### Invalid Status Transitions (6/6 passed)

| Test | Status | Assertion |
|------|--------|-----------|
| Open → Resolved (skip In Progress) | PASS | 400, message matches `/Invalid status transition/` |
| Open → Closed | PASS | 400, `success: false` |
| In Progress → Open (backward) | PASS | 400, `success: false` |
| Resolved → In Progress (backward) | PASS | 400, `success: false` |
| Closed → any status (terminal state) | PASS | 400, message matches `/terminal state/` |
| Cancelled → any status (terminal state) | PASS | 400, message matches `/terminal state/` |

### Ticket CRUD (6/6 passed)

| Test | Status | Assertion |
|------|--------|-----------|
| creates a ticket | PASS | 201, title and default status `Open` |
| lists tickets with status filter | PASS | 200, all results have status `Open` |
| returns all tickets when status filter is empty | PASS | 200, returns >= 2 tickets |
| searches tickets by keyword | PASS | 200, >= 1 result |
| returns 404 for non-existent ticket | PASS | 404 |
| deletes a ticket | PASS | 200, ticket null in DB after delete |

### Comments (2/2 passed)

| Test | Status | Assertion |
|------|--------|-----------|
| adds a comment to a ticket | PASS | 201, message returned |
| returns 404 when commenting on non-existent ticket | PASS | 404 |

## Test Infrastructure

**Setup (`tests/setup.js`):**
- `beforeAll` — starts mongodb-memory-server, connects Mongoose
- `afterEach` — clears all collections
- `afterAll` — drops database, closes connection, stops memory server

**Isolation:**
- Each test creates its own user and ticket in `beforeEach`
- No dependency on seed data
- Tests are repeatable and order-independent

## Coverage Gaps

| Area | Status |
|------|--------|
| User GET endpoints | Not tested |
| PUT ticket update validation | Not tested |
| Pagination boundaries | Not tested |
| Duplicate email on user create | Not tested (no user create endpoint) |
| Swagger doc accuracy | Manual only |

## Warnings

Jest outputs:
```
Force exiting Jest: Have you considered using `--detectOpenHandles`
```

This is expected due to `--forceExit` flag used to handle mongodb-memory-server cleanup. Does not indicate test failures.

## Last Run

```
Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
Time:        1.369 s
```
