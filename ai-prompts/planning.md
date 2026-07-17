# Planning Prompts — STMS

Use these prompts when scoping, breaking down, or sequencing work on the **Support Ticket Management System (STMS)**.

---

## Project Context (include in every planning prompt)

```
You are planning work for STMS — a full-stack MERN Support Ticket Management System.

Stack: React 18 + Vite + Tailwind (client/), Node.js + Express + Mongoose (server/), MongoDB.
Key docs: requirements-analysis.md, acceptance-criteria.md, implementation-plan.md, api-contract.md, data-model.md, ui-flow.md.
Assumptions: no authentication (MVP), single-tenant, English-only UI.
Critical business rule: enforced status workflow (Open → In Progress → Resolved → Closed; Cancelled from Open/In Progress).
```

---

## Feature Scoping

```
I want to add [FEATURE] to STMS.

1. Map it to existing functional requirements in requirements-analysis.md, or propose new FR-* IDs.
2. List acceptance criteria in Given/When/Then format (see acceptance-criteria.md).
3. Identify affected layers: models, controllers, routes, validators, frontend pages/components, API service, tests.
4. Flag whether it conflicts with MVP assumptions (no auth, seed users only).
5. Estimate effort by phase (backend foundation, business logic, tests, frontend, docs).
6. List risks and mitigations (e.g., status workflow bugs, API contract drift).
```

---

## Phased Implementation Plan

```
Create a phased implementation plan for [FEATURE/EPIC] in STMS.

Follow the structure in implementation-plan.md:
- Phase 1: Backend foundation (models, routes, controllers, error handling)
- Phase 2: Business logic and validation (status rules, express-validator, search/filter)
- Phase 3: Integration tests (Jest + Supertest + mongodb-memory-server)
- Phase 4: Frontend core (pages, components, TicketContext, api.js)
- Phase 5: Documentation and polish

For each phase, list tasks with deliverables and dependencies. Mark what can run in parallel (e.g., backend tests while frontend scaffolds).
```

---

## API-First Planning

```
Before implementing [FEATURE], plan the API changes for STMS.

Reference api-contract.md conventions:
- Base URL: /api
- Success: { success: true, data: ... }
- Error: { success: false, message: "..." }
- Status changes: PATCH /api/tickets/:id/status only (never via PUT)
- List endpoints: include pagination { total, page, limit, pages }

Output:
1. New or modified endpoints (method, path, request body, query params, response shapes)
2. Validation rules (express-validator)
3. Mongoose schema changes (data-model.md)
4. Integration test cases to add
5. Frontend api.js methods and affected pages
```

---

## Frontend Screen Planning

```
Plan the UI for [SCREEN/FEATURE] in STMS.

Reference ui-flow.md and existing pages in client/src/pages/.
Components live in client/src/components/; state in client/src/context/TicketContext.jsx.

Output:
1. Route path and page component name
2. User actions and API calls (via client/src/services/api.js)
3. Loading, empty, success, and error states
4. Reusable components to create vs. extend (Badge, Alert, Spinner, TicketForm, TicketFilters)
5. Status button visibility rules (mirror server/src/utils/statusTransitions.js and client/src/utils/constants.js)
```

---

## Post-MVP Backlog Prioritization

```
Review the future enhancements in implementation-plan.md:
- JWT authentication with RBAC
- WebSocket real-time comments
- Email notifications
- File attachments
- Frontend unit tests (RTL)
- CI/CD (GitHub Actions)
- Docker Compose

Prioritize [LIST OF CANDIDATES] for STMS considering:
1. User impact
2. Dependency on auth layer
3. Test and documentation effort
4. Risk to existing status workflow and API contract
```

---

## Pre-Implementation Checklist

Before starting any STMS task, confirm:

- [ ] Requirement mapped to `requirements-analysis.md` or new FR documented
- [ ] Acceptance criteria written and testable
- [ ] API contract updated if endpoints change
- [ ] Status transitions reviewed if workflow touched
- [ ] Both `server/` and `client/` impact assessed
- [ ] Integration tests planned (`server/tests/`)
- [ ] No new dependencies unless justified (Engineering: Dependency Discipline)
