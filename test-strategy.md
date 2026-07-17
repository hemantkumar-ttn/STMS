# Test Strategy

## Overview

STMS uses **integration tests** on the backend as the primary automated test layer. Tests run against a real Express app with an in-memory MongoDB instance — no mocks for database or HTTP layer.

Frontend testing is manual for MVP; automated frontend tests are listed as future work.

## Test Stack

| Tool | Purpose |
|------|---------|
| Jest | Test runner and assertions |
| Supertest | HTTP request testing against Express app |
| mongodb-memory-server | In-memory MongoDB for isolated test runs |

## Test Configuration

**File:** `server/package.json`

```json
{
  "jest": {
    "testEnvironment": "node",
    "testMatch": ["**/tests/**/*.test.js"],
    "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"]
  }
}
```

**Run command:**
```bash
cd server && npm test
```

**Environment:** `NODE_ENV=test`

## Test Setup (`tests/setup.js`)

| Hook | Action |
|------|--------|
| `beforeAll` | Start mongodb-memory-server, connect Mongoose |
| `afterEach` | Clear all collections |
| `afterAll` | Drop database, close connection, stop memory server |

This ensures each test starts with a clean database.

## Test Coverage

### Status Transitions (12 tests)

**Valid transitions (6):**

| Test | Endpoint | Body | Expected |
|------|----------|------|----------|
| Open → In Progress | PATCH /status | `{ status: "In Progress" }` | 200 |
| Open → Cancelled | PATCH /status | `{ status: "Cancelled" }` | 200 |
| In Progress → Resolved | PATCH /status | `{ status: "Resolved" }` | 200 |
| In Progress → Cancelled | PATCH /status | `{ status: "Cancelled" }` | 200 |
| Resolved → Closed | PATCH /status | `{ status: "Closed" }` | 200 |
| Same status (no-op) | PATCH /status | `{ status: "Open" }` | 200 |

**Invalid transitions (6):**

| Test | Expected | Assertion |
|------|----------|-----------|
| Open → Resolved | 400 | Message matches `/Invalid status transition/` |
| Open → Closed | 400 | `success: false` |
| In Progress → Open | 400 | `success: false` |
| Resolved → In Progress | 400 | `success: false` |
| Closed → Open | 400 | Message matches `/terminal state/` |
| Cancelled → Open | 400 | Message matches `/terminal state/` |

### Ticket CRUD (6 tests)

| Test | Endpoint | Expected |
|------|----------|----------|
| Create ticket | POST /tickets | 201, status defaults to Open |
| List with status filter | GET /tickets?status=Open | 200, all results are Open |
| List with empty status | GET /tickets?status= | 200, returns all tickets |
| Search by keyword | GET /tickets?search=status | 200, at least 1 result |
| Non-existent ticket | GET /tickets/:fakeId | 404 |
| Delete ticket | DELETE /tickets/:id | 200, ticket removed from DB |

### Comments (2 tests)

| Test | Endpoint | Expected |
|------|----------|----------|
| Add comment | POST /tickets/:id/comments | 201, message returned |
| Comment on missing ticket | POST /tickets/:fakeId/comments | 404 |

**Total: 20 tests**

## Test Data Strategy

Each test creates its own data in `beforeEach`:

```javascript
beforeEach(async () => {
  user = await User.create({ name: 'Test User', email: 'test@example.com', role: 'agent' });
  ticket = await Ticket.create({ title: 'Test Ticket', description: '...', status: 'Open', createdBy: user._id });
});
```

- No dependency on seed data
- Tests are fully isolated and repeatable
- `afterEach` clears all collections

## What Is NOT Tested (MVP Gaps)

| Area | Reason | Future Action |
|------|--------|---------------|
| Frontend components | Out of MVP scope | Add React Testing Library |
| Swagger docs accuracy | Manual verification | Contract testing |
| User endpoints | Read-only, low risk | Add basic GET tests |
| Pagination edge cases | Low priority | Add page/limit boundary tests |
| Concurrent status changes | Edge case | Add race condition tests |
| E2E browser tests | No Playwright/Cypress setup | Add Cypress suite |

## Manual Test Checklist

Use this for frontend verification:

### Dashboard
- [ ] All tickets load on first visit
- [ ] Search by keyword returns matching tickets
- [ ] Status filter shows only matching tickets
- [ ] "All Statuses" shows all tickets
- [ ] Empty state appears when no matches
- [ ] Clicking a ticket navigates to details

### Create Ticket
- [ ] Form validation prevents empty submit
- [ ] Ticket created and redirects to detail page
- [ ] Error shown on API failure

### Ticket Details
- [ ] All fields displayed correctly
- [ ] Only valid status buttons shown
- [ ] Invalid transition shows error (if forced via API)
- [ ] Comment added and appears in list
- [ ] Delete removes ticket and returns to dashboard

### Edit Ticket
- [ ] Form pre-filled with current data
- [ ] Changes saved and reflected on detail page

### Error Scenarios
- [ ] Backend down → proxy error / alert shown
- [ ] Invalid ticket ID in URL → error message

## CI Recommendation

```yaml
# .github/workflows/test.yml (future)
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: cd server && npm ci && npm test
      - run: cd client && npm ci && npm run build
```

## Test Quality Principles

1. **Test behavior, not implementation** — assert HTTP status and response body, not internal function calls
2. **One assertion focus per test** — each test verifies one scenario
3. **Descriptive test names** — e.g., `Open -> Resolved (skip In Progress)`
4. **No test interdependence** — each test creates and cleans its own data
5. **Business rules are highest priority** — status transitions have the most test coverage
