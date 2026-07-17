# Tasks — STMS

Implementation task list for Cursor-assisted development. MVP phases are **Done**; use post-MVP section for new work.

---

## Phase 1: Backend Foundation — Done

| # | Task | Status |
|---|------|--------|
| 1.1 | Initialize `server/` with Express, Mongoose, dotenv | Done |
| 1.2 | Create User, Ticket, Comment Mongoose models | Done |
| 1.3 | Implement ticket CRUD controllers | Done |
| 1.4 | Route structure: `/api/tickets`, `/api/users`, comments nested under tickets | Done |
| 1.5 | Centralized error handler (`AppError`, `errorHandler`) | Done |
| 1.6 | CORS and JSON body parsing | Done |
| 1.7 | `.env.example` and database connection module | Done |

**Deliverable:** Health check + basic ticket CRUD.

---

## Phase 2: Business Logic and Validation — Done

| # | Task | Status |
|---|------|--------|
| 2.1 | `statusTransitions.js` utility | Done |
| 2.2 | `PATCH /api/tickets/:id/status` endpoint | Done |
| 2.3 | Block status changes via PUT | Done |
| 2.4 | express-validator on all endpoints | Done |
| 2.5 | Text index search + status filter | Done |
| 2.6 | Seed script (5 users, 6 tickets, 4 comments) | Done |
| 2.7 | Swagger documentation | Done |
| 2.8 | Empty status filter fix (`checkFalsy` + `cleanParams`) | Done |

**Deliverable:** Status rules enforced; database seedable.

---

## Phase 3: Integration Tests — Done

| # | Task | Status |
|---|------|--------|
| 3.1 | Jest + Supertest + mongodb-memory-server setup | Done |
| 3.2 | Valid status transition tests (6 cases) | Done |
| 3.3 | Invalid status transition tests (6 cases) | Done |
| 3.4 | Ticket CRUD tests | Done |
| 3.5 | Search and filter tests (incl. empty status) | Done |
| 3.6 | Comment creation and 404 tests | Done |

**Deliverable:** 20 passing integration tests (`cd server && npm test`).

---

## Phase 4: Frontend Core — Done

| # | Task | Status |
|---|------|--------|
| 4.1 | Scaffold Vite + React 18 + Tailwind | Done |
| 4.2 | Vite proxy `/api` → `:5000` | Done |
| 4.3 | Axios API service + error interceptor | Done |
| 4.4 | TicketContext (useReducer) | Done |
| 4.5 | Components: Layout, Badge, Alert, Spinner, TicketForm, TicketFilters | Done |
| 4.6 | Dashboard with search and filter | Done |
| 4.7 | Create Ticket page | Done |
| 4.8 | Edit Ticket page | Done |
| 4.9 | Ticket Details (status, comments, delete) | Done |
| 4.10 | Loading, empty, success, error UI states | Done |

**Deliverable:** Full CRUD UI connected to API.

---

## Phase 5: Documentation and Polish — Done

| # | Task | Status |
|---|------|--------|
| 5.1 | Root README with setup | Done |
| 5.2 | Project documentation (specs, design, tests) | Done |
| 5.3 | `.gitignore` for node_modules, .env, dist | Done |
| 5.4 | Production build verified | Done |
| 5.5 | `ai-prompts/` folder | Done |
| 5.6 | `tool-specific/cursor-workflow/` | Done |
| 5.7 | `.cursor/rules/project-rules.mdc` | Done |

**Deliverable:** Production-quality docs and Cursor workflow.

---

## Cursor Task Template (New Work)

When starting a new task with Cursor, copy and fill in:

```markdown
## Task: [TITLE]

**Branch:** cursor/[ticket]-[summary]

**Goal:** [One sentence]

**Files likely affected:**
- server/src/...
- client/src/...
- server/tests/...

**Steps:**
1. [ ] Update spec / api-contract if API changes
2. [ ] Backend: model → controller → validator → route
3. [ ] Integration tests
4. [ ] Frontend: api.js → context → page/component
5. [ ] Manual UI check
6. [ ] Run `cd server && npm test`
7. [ ] Update acceptance-criteria.md if needed

**Definition of done:** See acceptance-criteria.md
```

---

## Post-MVP Backlog (Planned)

| # | Task | Priority | Notes |
|---|------|----------|-------|
| P1 | JWT authentication + RBAC | High | Blocks multi-user production use |
| P2 | GitHub Actions CI (test + build) | High | `server npm test`, `client npm run build` |
| P3 | Frontend unit tests (RTL) | Medium | Dashboard, TicketForm, status buttons |
| P4 | User endpoint integration tests | Low | GET `/api/users` |
| P5 | Real-time comments (WebSockets) | Low | Requires auth first |
| P6 | Email notifications | Low | Assignment events |
| P7 | File attachments on tickets | Low | Storage + API changes |
| P8 | Docker Compose dev environment | Medium | MongoDB + server + client |
| P9 | Helmet + rate limiting + CORS restrict | Medium | Production hardening |
| P10 | Pagination sort param | Low | Currently hardcoded `updatedAt: -1` |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Status transition bugs | `statusTransitions.js` + 12 transition tests |
| API contract drift | `api-contract.md` + shared constants |
| MongoDB not running | Document setup; tests use in-memory DB |
| Empty filter params | `cleanParams()` + `checkFalsy` validators |
| Backend down during frontend dev | Two-terminal startup in README |

---

## Estimated Effort (MVP — Complete)

| Phase | Hours |
|-------|-------|
| Backend Foundation | 3–4 |
| Business Logic | 2–3 |
| Integration Tests | 2 |
| Frontend Core | 4–5 |
| Documentation | 1–2 |
| **Total** | **12–16** |
