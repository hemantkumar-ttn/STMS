# Project Context — STMS

Use this file to onboard Cursor AI to the **Support Ticket Management System (STMS)** codebase.

---

## What This Project Is

STMS is a full-stack MERN web application for creating, tracking, and resolving support tickets. It enforces a strict status workflow, supports comments on tickets, and provides search and filtering on the dashboard.

**Primary users (MVP):** support agents and end users (represented by seed data — no login).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router, Axios, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Validation | express-validator |
| Testing | Jest, Supertest, mongodb-memory-server |
| API Docs | Swagger UI at `/api/docs` |

---

## Repository Layout

```
STMS/
├── client/                    # React frontend (Vite)
│   └── src/
│       ├── components/        # Reusable UI (Layout, Badge, Alert, Spinner, TicketForm, …)
│       ├── context/           # TicketContext (useReducer)
│       ├── pages/             # Dashboard, Create, Edit, Ticket Details
│       ├── services/          # api.js — all HTTP calls
│       └── utils/             # constants.js — status rules (mirror backend)
├── server/                    # Express backend
│   └── src/
│       ├── config/            # DB, Swagger
│       ├── controllers/       # Route handlers
│       ├── middleware/        # validators.js, errorHandler.js
│       ├── models/            # User, Ticket, Comment
│       ├── routes/            # Express routers + Swagger JSDoc
│       ├── seed/              # Sample data script
│       └── utils/             # statusTransitions.js
│   └── tests/                 # Jest integration tests (20 tests)
├── ai-prompts/                # Phase-specific AI prompts
├── tool-specific/cursor-workflow/  # Cursor workflow docs (this folder)
├── .cursor/rules/             # Cursor project rules
└── *.md                       # Root specs (api-contract, design-notes, …)
```

---

## Key Files to Reference

| File | Purpose |
|------|---------|
| `server/src/utils/statusTransitions.js` | Single source of truth for status workflow |
| `client/src/utils/constants.js` | Frontend mirror of allowed transitions |
| `client/src/services/api.js` | Axios client, `cleanParams()`, error interceptor |
| `client/src/context/TicketContext.jsx` | Global ticket state |
| `server/src/middleware/validators.js` | express-validator rules |
| `server/src/middleware/errorHandler.js` | AppError + global error handler |
| `server/tests/tickets.test.js` | Integration test suite |
| `api-contract.md` | REST API specification |
| `design-notes.md` | Architecture decisions |

---

## Status Workflow (Critical)

```
Open ──────────► In Progress ──► Resolved ──► Closed
  │                    │
  └────► Cancelled ◄───┘
```

- Enforced in `statusTransitions.js` on the server
- Changes via `PATCH /api/tickets/:id/status` only
- `PUT /api/tickets/:id` rejects status field updates
- `Closed` and `Cancelled` are terminal states

---

## MVP Assumptions

- **No authentication** — users come from seed data; frontend defaults to first agent for `createdBy`
- **Single tenant** — one organization
- **English only** — UI and API messages
- **React Context only** — no Redux, Zustand, or other state libraries

---

## How to Run Locally

```bash
# Terminal 1 — Backend
cd server && npm install && npm run seed && npm run dev

# Terminal 2 — Frontend
cd client && npm install && npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| Swagger | http://localhost:5000/api/docs |
| Health check | `curl http://localhost:5000/api/health` |

**Prerequisites:** Node.js >= 18, MongoDB >= 6 running locally.

Vite proxies `/api` → `http://localhost:5000` — frontend uses `baseURL: '/api'`.

---

## API Response Conventions

**Success:**
```json
{ "success": true, "data": { ... } }
```

**Error:**
```json
{ "success": false, "message": "Human-readable error" }
```

**List with pagination:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": { "total": 6, "page": 1, "limit": 20, "pages": 1 }
}
```

---

## Verification Commands

```bash
cd server && npm test          # 20 integration tests
cd client && npm run build     # Production build check
```

---

## Related Documentation

| Path | Description |
|------|-------------|
| `spec.md` | Functional and technical specification |
| `tasks.md` | Implementation phases and task list |
| `acceptance-criteria.md` | Testable success conditions |
| `cursor-rules-or-instructions.md` | Cursor AI usage instructions |
| `README.md` | Setup and scripts |
| `ai-prompts/` | Copy-paste prompts per development phase |
