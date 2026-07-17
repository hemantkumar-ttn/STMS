# Documentation Prompts — STMS

Use these prompts when writing or updating documentation for STMS.

---

## Project Context

```
STMS documentation lives at repo root and server/docs/:

Root docs (specs):
- requirements-analysis.md, acceptance-criteria.md, implementation-plan.md
- design-notes.md, api-contract.md, data-model.md, ui-flow.md, test-strategy.md, tool-workflow.md
- README.md — setup, scripts, API summary
- candidate-info.md — project overview index

Server docs (process):
- server/docs/setup-notes.md, debugging-notes.md, code-review-notes.md, test-results.md

API docs: Swagger UI at http://localhost:5000/api/docs (JSDoc in route files)
```

---

## Update README

```
Update STMS README.md for [CHANGE — new feature, script, env var, endpoint].

README sections to keep current:
- Tech stack table
- Project structure tree
- Prerequisites (Node >= 18, MongoDB >= 6)
- Setup (install, .env, seed, dev servers)
- API endpoints summary
- Status transition diagram
- Test command (cd server && npm test)
- Scripts reference (server + client)

Match existing tone: concise, copy-pasteable commands, no secrets.
```

---

## API Contract Update

```
Document new or changed STMS API endpoints in api-contract.md.

For each endpoint include:
- Method and path
- Query params / request body with types and validation
- Success response JSON with example
- Error responses (400, 404) with message examples
- Notes (e.g., status via PATCH only, empty status = all tickets)

Also add Swagger JSDoc to the route file in server/src/routes/.
Base URL: http://localhost:5000/api
```

---

## Acceptance Criteria

```
Write acceptance criteria for STMS feature: [FEATURE].

Format (from acceptance-criteria.md):
### AC-N: [Title]
**Given** ...
**When** ...
**Then** ...

Include checkboxes for testable sub-criteria.
Map to functional requirements (FR-*) in requirements-analysis.md.
Cover API and UI behavior where applicable.
```

---

## Design Notes Entry

```
Document a design decision for STMS: [DECISION].

Use design-notes.md format:
### N. [Decision Title]
**Decision:** ...
**Rationale:** (bullet points)
**Alternatives considered:** ...

Include mermaid diagram if architecture or workflow changed.
Update trade-offs table if relevant.
Cross-reference affected files (controllers, utils, frontend constants).
```

---

## Implementation Plan Update

```
Update implementation-plan.md for completed or new STMS work.

Phase structure:
1. Backend Foundation
2. Business Logic and Validation
3. Integration Tests
4. Frontend Core
5. Documentation and Polish

Mark task status (Done / In Progress / Planned).
Add risks and mitigations for new phases.
List future enhancements separately (post-MVP).
```

---

## Debugging Notes Entry

```
Add a debugging entry to server/docs/debugging-notes.md for STMS issue: [ISSUE].

Format:
### N. [Title]
**Symptom:** (error message or behavior)
**Cause:** ...
**Fix:** (commands or code change)
**Verify:** (curl or UI steps)

Include curl examples with jq where helpful.
Link to affected files (validators.js, api.js, statusTransitions.js).
```

---

## Changelog / PR Description

```
Write a PR description for STMS changes: [SUMMARY].

## Summary
- 1–3 bullet points (what and why)

## Changes
- File-by-file notable changes

## Test plan
- [ ] cd server && npm test
- [ ] Manual UI verification steps
- [ ] curl commands for API changes

Follow commit style: feat:, fix:, test:, docs:
Branch naming: cursor/<ticket>-<summary>
```

---

## Onboarding Doc

```
Create onboarding documentation for a new developer on STMS.

Cover:
1. What STMS does (support tickets, status workflow, comments)
2. Repo layout (client/, server/, docs/)
3. First-time setup (install, .env, seed, two terminals)
4. Key URLs (frontend, API, Swagger)
5. Where business rules live (statusTransitions.js, constants.js)
6. How to run tests
7. Where to find specs (requirements, api-contract, acceptance-criteria)
8. MVP assumptions (no auth, seed users)

Keep under 2 pages; link to README.md for details.
```

---

## Swagger JSDoc

```
Add Swagger JSDoc annotations for STMS route: [METHOD] [PATH].

Follow existing annotations in server/src/routes/ticketRoutes.js:
- @swagger tag, summary, parameters, requestBody, responses
- Reference Ticket, Comment, User schemas from server/src/config/swagger.js
- Document query params: search, status, page, limit
- Document status enum values

Verify at http://localhost:5000/api/docs after server restart.
```
