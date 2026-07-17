# Implementation Plan

## Overview

Build STMS in four phases: backend foundation, business logic and tests, frontend core, and polish/documentation.

## Phase 1: Backend Foundation

**Goal:** Running Express server with MongoDB models and basic CRUD.

| Task | Status |
|------|--------|
| Initialize `server/` with Express, Mongoose, dotenv | Done |
| Create User, Ticket, Comment Mongoose models | Done |
| Implement ticket CRUD controllers | Done |
| Set up route structure (`/api/tickets`, `/api/users`, `/api/comments`) | Done |
| Add centralized error handler (`AppError`, `errorHandler`) | Done |
| Configure CORS and JSON body parsing | Done |
| Create `.env.example` and database connection module | Done |

**Deliverable:** API responds to health check and basic ticket CRUD.

## Phase 2: Business Logic and Validation

**Goal:** Enforce status workflow, input validation, and seed data.

| Task | Status |
|------|--------|
| Implement `statusTransitions.js` utility | Done |
| Add `PATCH /api/tickets/:id/status` endpoint | Done |
| Block status changes via `PUT /api/tickets/:id` | Done |
| Add express-validator rules for all endpoints | Done |
| Implement search (text index) and status filter | Done |
| Create seed script (5 users, 6 tickets, 4 comments) | Done |
| Add Swagger documentation | Done |
| Fix empty status filter validation (`checkFalsy`) | Done |

**Deliverable:** Status rules enforced server-side; database seedable.

## Phase 3: Integration Tests

**Goal:** Automated verification of critical business rules.

| Task | Status |
|------|--------|
| Set up Jest + Supertest + mongodb-memory-server | Done |
| Test all valid status transitions (6 cases) | Done |
| Test all invalid status transitions (6 cases) | Done |
| Test ticket CRUD operations | Done |
| Test search and status filter (including empty filter) | Done |
| Test comment creation and 404 cases | Done |

**Deliverable:** 20 passing integration tests.

## Phase 4: Frontend Core

**Goal:** Responsive React app with full ticket lifecycle UI.

| Task | Status |
|------|--------|
| Scaffold Vite + React 18 + Tailwind CSS | Done |
| Configure Vite proxy to backend (`/api` → `:5000`) | Done |
| Create Axios API service layer with error interceptor | Done |
| Implement TicketContext (useReducer) | Done |
| Build reusable components (Layout, Badge, Alert, Spinner, TicketForm, TicketFilters) | Done |
| Dashboard page with search and filter | Done |
| Create Ticket page | Done |
| Edit Ticket page | Done |
| Ticket Details page (status change, comments, delete) | Done |
| Handle loading, empty, success, and error UI states | Done |

**Deliverable:** Full CRUD UI connected to backend API.

## Phase 5: Documentation and Polish

**Goal:** Production-quality documentation and developer experience.

| Task | Status |
|------|--------|
| Root README with setup instructions | Done |
| Project documentation files (this set) | Done |
| `.gitignore` for node_modules, .env, dist | Done |
| Verify production build (`npm run build`) | Done |

## Timeline Estimate

| Phase | Estimated Effort |
|-------|-----------------|
| Phase 1: Backend Foundation | 3–4 hours |
| Phase 2: Business Logic | 2–3 hours |
| Phase 3: Integration Tests | 2 hours |
| Phase 4: Frontend Core | 4–5 hours |
| Phase 5: Documentation | 1–2 hours |
| **Total** | **12–16 hours** |

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Status transition bugs | Dedicated utility module + 12 integration tests |
| Frontend/backend contract drift | `api-contract.md` + shared status constants |
| MongoDB not running locally | Document setup; tests use in-memory DB |
| Empty filter params breaking API | `cleanParams()` on frontend + `checkFalsy` on backend |
| Proxy errors when backend is down | Document two-terminal startup in README |

## Future Enhancements (Post-MVP)

1. JWT authentication with role-based access control
2. Real-time comment updates via WebSockets
3. Ticket assignment notifications (email)
4. File attachment support
5. Frontend unit tests (React Testing Library)
6. CI/CD pipeline (GitHub Actions)
7. Docker Compose for one-command startup
