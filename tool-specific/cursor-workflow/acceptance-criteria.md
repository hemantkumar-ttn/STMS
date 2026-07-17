# Acceptance Criteria — STMS

Testable success conditions for Cursor-assisted work. Each feature is done when all applicable criteria pass.

> Canonical copy also at repo root: `/acceptance-criteria.md`

---

## Definition of Done

A feature or fix is complete when:

1. Backend endpoint implemented with express-validator (if API change)
2. Frontend UI consumes the endpoint (if user-facing)
3. Integration test(s) pass in `server/tests/`
4. Loading, empty, success, and error states handled in UI
5. `cd server && npm test` — no regressions (20 tests)
6. `api-contract.md` and this file updated if behavior changed

---

## Ticket CRUD

### AC-1: Create Ticket

**Given** a valid user ID and ticket data  
**When** `POST /api/tickets` is called  
**Then** ticket is created with status `Open` and HTTP 201

- [x] Title and description required
- [x] Priority defaults to `Medium`
- [x] `createdBy` and `assignedTo` populated in response

### AC-2: List Tickets

**Given** tickets exist  
**When** `GET /api/tickets` is called  
**Then** tickets returned with pagination metadata

- [x] Default page size 20
- [x] Sorted by `updatedAt` descending
- [x] `createdBy` and `assignedTo` populated

### AC-3: Get Ticket by ID

**Given** a valid ticket ID  
**When** `GET /api/tickets/:id` is called  
**Then** ticket and comments returned

- [x] 404 for non-existent ID
- [x] 400 for invalid ObjectId

### AC-4: Update Ticket

**Given** an existing ticket  
**When** `PUT /api/tickets/:id` is called  
**Then** fields updated (status excluded)

- [x] Status via PUT returns 400 with redirect message to PATCH endpoint
- [x] Assignee must reference existing user

### AC-5: Delete Ticket

**Given** ticket with comments  
**When** `DELETE /api/tickets/:id` is called  
**Then** ticket and comments removed

- [x] 404 for non-existent ticket

---

## Status Transitions

### AC-6: Valid Transitions (expect 200)

| From | To |
|------|----|
| Open | In Progress |
| Open | Cancelled |
| In Progress | Resolved |
| In Progress | Cancelled |
| Resolved | Closed |
| Any | Same status (no-op) |

- [x] Covered by integration tests in `server/tests/tickets.test.js`

### AC-7: Invalid Transitions (expect 400)

| From | To |
|------|----|
| Open | Resolved |
| Open | Closed |
| In Progress | Open |
| Resolved | In Progress |
| Closed | Open |
| Cancelled | Open |

- [x] Error describes allowed transitions
- [x] Terminal state message includes "terminal state"

---

## Search and Filter

### AC-8: Search

**When** `GET /api/tickets?search=keyword`  
**Then** matching tickets returned (text index on title + description)

### AC-9: Status Filter

**When** `GET /api/tickets?status=Open`  
**Then** only Open tickets returned

### AC-10: All Statuses

**When** dashboard loads with "All Statuses" or `status=` empty  
**Then** all tickets returned (no filter applied)

- [x] `cleanParams()` strips empty status on frontend
- [x] `checkFalsy` on backend validator

---

## Comments

### AC-11: Add Comment

**When** `POST /api/tickets/:ticketId/comments`  
**Then** comment created with HTTP 201

- [x] Message required (max 2000 chars)
- [x] 404 if ticket missing

### AC-12: List Comments

**When** comments fetched for a ticket  
**Then** chronological order with author info

---

## Frontend

### AC-13: Dashboard

- [x] Ticket list on load
- [x] Search filters by keyword
- [x] Status dropdown filters
- [x] "All Statuses" shows all
- [x] Loading spinner
- [x] Empty state when no matches

### AC-14: Create Ticket

- [x] Form validation
- [x] Priority and assignee selectable
- [x] Redirect to detail on success
- [x] Error alert on failure

### AC-15: Ticket Detail

- [x] Full ticket info displayed
- [x] Status buttons = valid transitions only
- [x] Comments list + add form
- [x] Edit and Delete available

### AC-16: Edit Ticket

- [x] Form pre-filled
- [x] Updates on submit
- [x] Redirect to detail on success

---

## API Quality

### AC-17: Validation

- [x] Invalid input → HTTP 400 with descriptive message
- [x] express-validator on all write endpoints

### AC-18: Error Handling

- [x] `{ success: false, message }` format
- [x] Mongoose validation errors → 400
- [x] Invalid ObjectId → 400

---

## Cursor Verification Checklist

Run before marking any Cursor task complete:

```bash
cd server && npm test
cd client && npm run build   # for UI changes
curl http://localhost:5000/api/health
```

Manual UI (if frontend touched):

- [ ] Dashboard load, search, filter
- [ ] Create → detail redirect
- [ ] Edit → save → detail
- [ ] Status buttons match workflow
- [ ] Add comment appears in list
- [ ] Delete returns to dashboard
- [ ] Backend down shows error alert
