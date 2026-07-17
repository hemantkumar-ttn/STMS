# Prompt History — STMS

Step-by-step record of all Cursor AI prompts used on the **Support Ticket Management System (STMS)** project.

**How to use this file:** Append each new prompt at the bottom under [New Prompts](#new-prompts). Include date, step number, prompt text, and outcome.

---

## Summary

| Metric | Value |
|--------|-------|
| AI tool | Cursor AI Agent |
| Sessions | 2 (initial build + workflow/docs) |
| Total prompts | 12 |
| Primary outcome | Full MERN app + docs + Cursor workflow |

---

## Session 1 — Initial Build & Debugging

**Date:** Friday, Jul 17, 2026 (~4:25 PM – 5:31 PM UTC+5:30)

### Step 1 — Project scaffolding (full spec)

**Prompt:**
```
Create a full-stack Support Ticket Management System using the MERN stack.

Tech Stack:
- Frontend: React 18 + Vite + React Router + Axios + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB with Mongoose
- Validation: express-validator
- Testing: Jest + Supertest for integration tests
- API documentation: Swagger (optional)
- Environment variables using .env

Project Structure:
root/
  client/
  server/

Backend Requirements:
- REST APIs for Tickets, Comments, and Users (seed data only)
- MongoDB models: User, Ticket, Comment
- CRUD for Tickets
- Add comments to tickets
- Search tickets by keyword
- Filter tickets by status
- Backend validation and centralized error handling
- Seed sample users and tickets
- Enforce ticket status transitions:
  Open -> In Progress
  In Progress -> Resolved
  Resolved -> Closed
  Open -> Cancelled
  In Progress -> Cancelled
  Reject invalid transitions with proper HTTP errors.
- Integration tests covering valid and invalid status transitions.

Frontend Requirements:
- Responsive dashboard
- Ticket list with search and status filter
- Create Ticket page, Edit Ticket page, Ticket Details page
- Add comments, change ticket status
- Loading, empty state, success and error UI
- Use React Hooks and Context API for state management.

Deliverables:
- Complete CRUD application
- README with setup instructions
- MongoDB seed script
- Clean folder structure, reusable components
- Proper API service layer
- Well-commented, production-quality code
```

**Outcome:**
- Created full `server/` (models, controllers, routes, middleware, seed, Swagger, 20 integration tests)
- Created full `client/` (Vite + React, pages, components, TicketContext, api.js)
- Created root `README.md`
- Verified: `npm test` (20/20), `npm run build`, `npm run seed`

---

### Step 2 — MongoDB startup

**Prompt:**
```
how to start MongoDB
```

**Outcome:**
- Documented startup via `systemctl`, Docker, and `mongosh` ping check
- User enabled local MongoDB for dev and seed

---

### Step 3 — API 500 error on users endpoint

**Prompt:**
```
http://localhost:3001/api/users getting api 500 error
```

**Outcome:**
- Diagnosed: backend not running on port 5000 (Vite proxy ECONNREFUSED)
- Started `cd server && npm run dev`
- Verified health check and `/api/users` via curl

---

### Step 4 — Dashboard “All Statuses” filter bug

**Prompt:**
```
on dashboard screen by default all status is selected, so on this status i want to show all tickets
```

**Outcome:**
- Root cause: empty `status=` query param failed express-validator
- **Backend fix:** `query('status').optional({ checkFalsy: true })` in `validators.js`
- **Frontend fix:** `cleanParams()` in `client/src/services/api.js`
- Verified: `GET /api/tickets?status=` returns all tickets with 200

---

### Step 5 — Root documentation set

**Prompt:**
```
create below md files on root on the basis of support ticket management system

candidate-info.md
tool-workflow.md
requirements-analysis.md
acceptance-criteria.md
implementation-plan.md
design-notes.md
api-contract.md
data-model.md
ui-flow.md
test-strategy.md
```

**Outcome:**
- Created 10 root-level markdown spec files from implemented codebase
- Documents cover requirements, API contract, data model, UI flows, tests, workflow

---

### Step 6 — Server documentation set

**Prompt:**
```
under the server folder create below md files on the basis of project

setup-notes.md
test-results.md
debugging-notes.md
code-review-notes.md
review-fixes.md
pr-description.md
reflection.md
final-ai-usage-summary.md
```

**Outcome:**
- Created 8 files under `server/docs/`
- Includes setup notes, test results, debugging guide, code review, PR template, reflection, AI usage summary

---

## Session 2 — AI Workflow & Cursor Configuration

**Date:** Friday, Jul 17, 2026 (~5:37 PM – 6:19 PM UTC+5:30)

### Step 7 — AI prompts folder

**Prompt:**
```
create ai-prompts folder on root and create mentioned md file on the basis of project

ai-prompts/
    planning.md
    design.md
    implementation.md
    testing.md
    debugging.md
    code-review.md
    documentation.md
```

**Outcome:**
- Created `ai-prompts/` with 7 phase-specific prompt template files
- Each file tailored to STMS stack, paths, and conventions

---

### Step 8 — Cursor workflow folder

**Prompt:**
```
create folder on root tool-specific/cursor-workflow under this folder please mention cursor ai workflow
```

**Outcome:**
- Created `tool-specific/cursor-workflow/cursor-workflow.md`
- Documented Cursor phases, @-mentions, git workflow, verification checklist

---

### Step 9 — Cursor project rules

**Prompt:**
```
create .cursor/rules/project-rules.mdc file on root on the basis of project
```

**Outcome:**
- Created `.cursor/rules/project-rules.mdc` with `alwaysApply: true`
- Enforces status workflow, API patterns, testing, git, anti-patterns

---

### Step 10 — Cursor workflow pack (5 files)

**Prompt:**
```
create tool-specific/cursor-workflow/ folder on root and create
these files
project-context.md, spec.md, tasks.md, acceptance-criteria.md, and cursor-rules-or-instructions.md
```

**Outcome:**
- Created 5 workflow files in `tool-specific/cursor-workflow/`:
  - `project-context.md` — codebase onboarding
  - `spec.md` — functional/technical specification
  - `tasks.md` — phased tasks (MVP done) + post-MVP backlog
  - `acceptance-criteria.md` — testable success conditions
  - `cursor-rules-or-instructions.md` — how to use Cursor with STMS

---

### Step 11 — Prompt history file (this file)

**Prompt:**
```
added a prompt history file under ai-prompts to save all prompt history step by step in this file for this project
```

**Outcome:**
- Created `ai-prompts/prompt-history.md` (this document)
- Recorded all prompts from Sessions 1 and 2 with outcomes

---

## Prompt → Deliverable Map

| Step | Prompt theme | Key files / areas |
|------|--------------|-------------------|
| 1 | Full MERN build | `server/`, `client/`, `README.md` |
| 2 | MongoDB ops | Operational guidance |
| 3 | API 500 debug | Backend startup |
| 4 | Status filter fix | `validators.js`, `api.js` |
| 5 | Root docs | 10 `*.md` at repo root |
| 6 | Server docs | 8 files in `server/docs/` |
| 7 | AI prompts | `ai-prompts/*.md` (7 files) |
| 8 | Cursor workflow | `tool-specific/cursor-workflow/` |
| 9 | Cursor rules | `.cursor/rules/project-rules.mdc` |
| 10 | Workflow pack | 5 files in `tool-specific/cursor-workflow/` |
| 11 | Prompt history | `ai-prompts/prompt-history.md` |

---

## New Prompts

Append new entries below using this template:

```markdown
### Step N — [Short title]

**Date:** [YYYY-MM-DD]

**Prompt:**
\`\`\`
[Paste exact prompt text]
\`\`\`

**Outcome:**
- [What was created, fixed, or changed]
- [Files affected]
- [Verification: tests run, manual checks]
```

---

<!-- Add new prompt history entries below this line -->
