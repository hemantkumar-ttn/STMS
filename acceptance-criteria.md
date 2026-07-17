# Acceptance Criteria

Each criterion is testable and maps to implemented functionality.

## Ticket CRUD

### AC-1: Create Ticket

**Given** a valid user ID and ticket data  
**When** `POST /api/tickets` is called  
**Then** a ticket is created with status `Open` and HTTP 201 is returned

- [x] Title and description are required
- [x] Priority defaults to `Medium` if omitted
- [x] Returns populated `createdBy` and `assignedTo` fields

### AC-2: List Tickets

**Given** seeded tickets exist  
**When** `GET /api/tickets` is called  
**Then** all tickets are returned with pagination metadata

- [x] Default page size is 20
- [x] Tickets sorted by `updatedAt` descending
- [x] `createdBy` and `assignedTo` are populated

### AC-3: Get Ticket by ID

**Given** a valid ticket ID  
**When** `GET /api/tickets/:id` is called  
**Then** ticket details and associated comments are returned

- [x] Returns 404 for non-existent ID
- [x] Returns 400 for invalid ObjectId format

### AC-4: Update Ticket

**Given** an existing ticket  
**When** `PUT /api/tickets/:id` is called with updated fields  
**Then** the ticket is updated (excluding status)

- [x] Status cannot be changed via PUT (returns 400)
- [x] Assignee must reference an existing user

### AC-5: Delete Ticket

**Given** an existing ticket with comments  
**When** `DELETE /api/tickets/:id` is called  
**Then** the ticket and all its comments are removed

- [x] Returns 404 for non-existent ticket

## Status Transitions

### AC-6: Valid Transitions

| From | To | Expected |
|------|----|----------|
| Open | In Progress | 200 |
| Open | Cancelled | 200 |
| In Progress | Resolved | 200 |
| In Progress | Cancelled | 200 |
| Resolved | Closed | 200 |
| Any | Same status | 200 (no-op) |

- [x] All valid transitions covered by integration tests

### AC-7: Invalid Transitions

| From | To | Expected |
|------|----|----------|
| Open | Resolved | 400 |
| Open | Closed | 400 |
| In Progress | Open | 400 |
| Resolved | In Progress | 400 |
| Closed | Open | 400 |
| Cancelled | Open | 400 |

- [x] Error message describes allowed transitions
- [x] Terminal state message mentions "terminal state"

## Search and Filter

### AC-8: Search

**Given** tickets with searchable text  
**When** `GET /api/tickets?search=keyword` is called  
**Then** matching tickets are returned

- [x] Search uses MongoDB text index on title and description

### AC-9: Status Filter

**Given** tickets with various statuses  
**When** `GET /api/tickets?status=Open` is called  
**Then** only Open tickets are returned

### AC-10: All Statuses (Default)

**Given** the dashboard loads with "All Statuses" selected  
**When** tickets are fetched  
**Then** all tickets are returned regardless of status

- [x] Empty status parameter does not filter results

## Comments

### AC-11: Add Comment

**Given** an existing ticket and valid user  
**When** `POST /api/tickets/:ticketId/comments` is called  
**Then** comment is created with HTTP 201

- [x] Message is required (max 2000 chars)
- [x] Returns 404 if ticket does not exist

### AC-12: List Comments

**Given** a ticket with comments  
**When** comments are fetched  
**Then** they are returned in chronological order with author info

## Frontend

### AC-13: Dashboard

- [x] Displays ticket list on load
- [x] Search input filters by keyword
- [x] Status dropdown filters by status
- [x] "All Statuses" shows all tickets
- [x] Loading spinner while fetching
- [x] Empty state when no tickets match

### AC-14: Create Ticket Page

- [x] Form validates required fields
- [x] Priority and assignee selectable
- [x] Redirects to ticket detail on success
- [x] Error alert on failure

### AC-15: Ticket Detail Page

- [x] Shows full ticket information
- [x] Status buttons show only valid next statuses
- [x] Comments section with add form
- [x] Edit and Delete actions available

### AC-16: Edit Ticket Page

- [x] Pre-fills existing ticket data
- [x] Updates ticket on submit
- [x] Redirects to detail page on success

## API Quality

### AC-17: Validation

- [x] Invalid input returns HTTP 400 with descriptive message
- [x] All write endpoints use express-validator

### AC-18: Error Handling

- [x] Consistent JSON error format: `{ success: false, message }`
- [x] Mongoose validation errors return 400
- [x] Invalid ObjectId returns 400

## Definition of Done

A feature is done when:

1. Backend endpoint is implemented with validation
2. Frontend UI consumes the endpoint
3. Integration test(s) pass (where applicable)
4. Error and loading states are handled in UI
5. No regressions in existing test suite
