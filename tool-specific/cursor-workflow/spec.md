# Specification — STMS

Technical and functional specification for the Support Ticket Management System. Use with Cursor for implementation and review.

> Full details: `requirements-analysis.md`, `api-contract.md`, `data-model.md`, `ui-flow.md`

---

## Problem Statement

Organizations need a centralized system to track support requests from submission through resolution. STMS provides structured ticket lifecycle management, searchable records, and threaded comments — with server-enforced status rules.

---

## Functional Requirements

### FR-1: Ticket Management

| ID | Requirement |
|----|-------------|
| FR-1.1 | Create ticket with title, description, priority |
| FR-1.2 | Read single ticket with full details and comments |
| FR-1.3 | List tickets with pagination (default limit 20) |
| FR-1.4 | Update fields: title, description, priority, assignee (not status) |
| FR-1.5 | Delete ticket and cascade-delete comments |
| FR-1.6 | Default status on create: `Open` |
| FR-1.7 | Default priority on create: `Medium` |

### FR-2: Status Workflow

| ID | Requirement |
|----|-------------|
| FR-2.1 | Enforce valid transitions server-side |
| FR-2.2 | Reject invalid transitions with HTTP 400 |
| FR-2.3 | Status changes via `PATCH /api/tickets/:id/status` |
| FR-2.4 | Block status changes via `PUT /api/tickets/:id` |
| FR-2.5 | Terminal states (`Closed`, `Cancelled`) cannot transition |

**Allowed transitions:**

| From | To |
|------|----|
| Open | In Progress, Cancelled |
| In Progress | Resolved, Cancelled |
| Resolved | Closed |
| Closed | *(none)* |
| Cancelled | *(none)* |

Same-status change is a no-op (HTTP 200).

### FR-3: Comments

| ID | Requirement |
|----|-------------|
| FR-3.1 | Add comment to a ticket |
| FR-3.2 | List comments chronologically with author info |
| FR-3.3 | Delete comments when parent ticket is deleted |

### FR-4: Search and Filter

| ID | Requirement |
|----|-------------|
| FR-4.1 | Keyword search on title and description (MongoDB text index) |
| FR-4.2 | Filter by status |
| FR-4.3 | Empty or omitted status returns all tickets |
| FR-4.4 | Combine search and status filter |

### FR-5: Users

| ID | Requirement |
|----|-------------|
| FR-5.1 | Users from seed data only (no registration) |
| FR-5.2 | `GET /api/users` — list all users |
| FR-5.3 | `GET /api/users/:id` — get user by ID |
| FR-5.4 | Roles: `admin`, `agent`, `user` |

### FR-6: Frontend

| ID | Requirement |
|----|-------------|
| FR-6.1 | Responsive dashboard with ticket list |
| FR-6.2 | Create, edit, and detail pages |
| FR-6.3 | Status buttons show only valid next statuses |
| FR-6.4 | Loading, empty, success, and error UI states |
| FR-6.5 | React Context API + useReducer for state |

---

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | RESTful API design |
| NFR-2 | Input validation on all write endpoints |
| NFR-3 | Centralized error handling; consistent JSON responses |
| NFR-4 | Environment config via `.env` |
| NFR-5 | Integration tests for status transitions |
| NFR-6 | Swagger API documentation |
| NFR-7 | Separation: models, controllers, routes, services |

---

## API Endpoints Summary

Base URL: `http://localhost:5000/api`

### Tickets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tickets` | List (search, status, page, limit) |
| GET | `/tickets/:id` | Get ticket + comments |
| POST | `/tickets` | Create ticket |
| PUT | `/tickets/:id` | Update fields (not status) |
| PATCH | `/tickets/:id/status` | Change status |
| DELETE | `/tickets/:id` | Delete ticket + comments |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tickets/:ticketId/comments` | List comments |
| POST | `/tickets/:ticketId/comments` | Add comment |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List users |
| GET | `/users/:id` | Get user |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API health check |

**Valid status values:** `Open`, `In Progress`, `Resolved`, `Closed`, `Cancelled`  
**Valid priority values:** `Low`, `Medium`, `High`, `Critical`

---

## Data Model Summary

### User (`users`)

- `name`, `email` (unique), `role` (admin | agent | user)

### Ticket (`tickets`)

- `title`, `description`, `priority`, `status`
- `assignedTo` → User, `createdBy` → User
- Text index on `title` + `description`

### Comment (`comments`)

- `ticketId` → Ticket, `message`, `createdBy` → User

Seed data: 5 users, 6 tickets, 4 comments (`npm run seed`).

---

## Frontend Routes

| Route | Page |
|-------|------|
| `/` | Dashboard — search, filter, ticket list |
| `/tickets/new` | Create ticket |
| `/tickets/:id` | Details — status, comments, delete |
| `/tickets/:id/edit` | Edit ticket fields |

---

## Out of Scope (MVP)

- Authentication and authorization
- WebSockets / real-time updates
- File attachments
- Email notifications
- Multi-tenancy
- Role-based UI restrictions
- Frontend unit tests (future)

---

## Technical Constraints

- MERN stack only
- React 18 + Vite (not CRA)
- Tailwind CSS for styling
- Context API for state — no Redux/Zustand
- No new dependencies without justification

---

## Post-MVP Enhancements

1. JWT authentication with RBAC
2. Real-time comments (WebSockets)
3. Email assignment notifications
4. File attachments
5. React Testing Library frontend tests
6. GitHub Actions CI/CD
7. Docker Compose one-command startup
