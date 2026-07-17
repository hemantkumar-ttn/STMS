# Requirements Analysis

## Problem Statement

Organizations need a centralized system to track support requests from submission through resolution. Without structured workflows, tickets can be lost, statuses changed arbitrarily, and communication scattered across channels.

STMS provides a web-based solution where users create tickets, agents work them through a defined lifecycle, and all activity is searchable and auditable via comments.

## Stakeholders

| Role | Needs |
|------|-------|
| End User | Submit tickets, view status, add comments |
| Support Agent | View assigned tickets, update status, respond via comments |
| Admin | Oversee all tickets, assign agents |
| Developer | Maintainable API, testable business rules |

## Functional Requirements

### FR-1: Ticket Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | Create ticket with title, description, priority | Must |
| FR-1.2 | Read single ticket with full details | Must |
| FR-1.3 | List all tickets with pagination | Must |
| FR-1.4 | Update ticket fields (title, description, priority, assignee) | Must |
| FR-1.5 | Delete ticket and associated comments | Must |
| FR-1.6 | Default status on creation is `Open` | Must |
| FR-1.7 | Default priority is `Medium` | Should |

### FR-2: Status Workflow

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | Enforce valid status transitions server-side | Must |
| FR-2.2 | Reject invalid transitions with HTTP 400 | Must |
| FR-2.3 | Status changes via dedicated endpoint (`PATCH /status`) | Must |
| FR-2.4 | Prevent status changes through general update endpoint | Must |
| FR-2.5 | Terminal states (`Closed`, `Cancelled`) cannot transition | Must |

**Allowed transitions:**

```
Open          → In Progress, Cancelled
In Progress   → Resolved, Cancelled
Resolved      → Closed
Closed        → (none)
Cancelled     → (none)
```

### FR-3: Comments

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | Add comment to a ticket | Must |
| FR-3.2 | List comments for a ticket (chronological) | Must |
| FR-3.3 | Comments deleted when parent ticket is deleted | Must |

### FR-4: Search and Filter

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | Search tickets by keyword (title, description) | Must |
| FR-4.2 | Filter tickets by status | Must |
| FR-4.3 | Empty status filter returns all tickets | Must |
| FR-4.4 | Combine search and status filter | Should |

### FR-5: Users

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | Users provided via seed data only | Must |
| FR-5.2 | List all users | Must |
| FR-5.3 | Get user by ID | Must |
| FR-5.4 | Roles: admin, agent, user | Should |

### FR-6: Frontend

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-6.1 | Responsive dashboard with ticket list | Must |
| FR-6.2 | Create, edit, and detail pages | Must |
| FR-6.3 | Status change UI showing only valid transitions | Must |
| FR-6.4 | Loading, empty, success, and error states | Must |
| FR-6.5 | React Context API for state management | Must |

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | RESTful API design |
| NFR-2 | Input validation on all write endpoints |
| NFR-3 | Centralized error handling with consistent JSON responses |
| NFR-4 | Environment-based configuration via `.env` |
| NFR-5 | Integration test coverage for status transitions |
| NFR-6 | API documentation via Swagger |
| NFR-7 | Clean separation: models, controllers, routes, services |

## Out of Scope

- User authentication and authorization
- Real-time notifications (WebSockets)
- File attachments on tickets
- Email integration
- Multi-tenancy
- Audit log beyond comments
- Role-based UI restrictions

## Constraints

- MERN stack (MongoDB, Express, React, Node.js)
- React 18 with Vite (not Create React App)
- Tailwind CSS for styling
- No additional state management libraries (Context API only)
