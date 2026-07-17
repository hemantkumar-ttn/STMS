# Cursor Rules and Instructions — STMS

How to configure and use Cursor AI when working on the Support Ticket Management System.

---

## Cursor Rules (Automatic)

Project rules live at:

```
.cursor/rules/project-rules.mdc
```

`alwaysApply: true` — Cursor loads these in every Agent session. They cover:

- MERN architecture and folder conventions
- Status workflow (PATCH only, `statusTransitions.js`)
- Backend patterns (validators, `next(error)`, response format)
- Frontend patterns (`api.js`, TicketContext, UI states)
- MVP scope (no auth unless requested)
- Testing, git branches, anti-patterns

**Do not duplicate rules elsewhere** — update `project-rules.mdc` when conventions change.

---

## Workflow Files (This Folder)

| File | Use in Cursor chat |
|------|-------------------|
| `project-context.md` | Paste or `@` at session start for codebase overview |
| `spec.md` | Reference for what to build |
| `tasks.md` | Current phase, backlog, task template |
| `acceptance-criteria.md` | Definition of done and verification |
| `cursor-rules-or-instructions.md` | This file — how to use Cursor |

---

## Starting a Cursor Session

### 1. Open workspace

Open the `STMS/` root folder in Cursor (not `client/` or `server/` alone).

### 2. Start dev environment

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

MongoDB must be running for local dev (tests use in-memory DB).

### 3. Prime context

In Agent chat, reference key files:

```
@tool-specific/cursor-workflow/project-context.md
@tool-specific/cursor-workflow/spec.md
@.cursor/rules/project-rules.mdc
```

For a specific task add:

```
@tool-specific/cursor-workflow/tasks.md
@tool-specific/cursor-workflow/acceptance-criteria.md
```

---

## Cursor Modes

| Mode | When to use |
|------|-------------|
| **Agent** | Multi-file features: API + UI + tests |
| **Ask** | Explain workflow, read architecture — no edits |
| **Plan** | Large epics (auth, WebSockets) before coding |

---

## Phase-Based Prompts

Use templates in `ai-prompts/`:

| Phase | File |
|-------|------|
| Planning | `ai-prompts/planning.md` |
| Design | `ai-prompts/design.md` |
| Implementation | `ai-prompts/implementation.md` |
| Testing | `ai-prompts/testing.md` |
| Debugging | `ai-prompts/debugging.md` |
| Code review | `ai-prompts/code-review.md` |
| Documentation | `ai-prompts/documentation.md` |

**Example Agent prompt:**

```
@ai-prompts/implementation.md @api-contract.md

Implement [feature]. Follow project-rules.mdc:
backend controller + validator + route + integration test,
then frontend api.js + TicketContext + page. Minimal diff.
```

---

## @-Mention Guide

| Task type | Files to @ |
|-----------|-----------|
| Status workflow | `statusTransitions.js`, `constants.js`, `tickets.test.js` |
| New API endpoint | `api-contract.md`, `validators.js`, route file |
| Frontend page | `TicketContext.jsx`, `api.js`, `ui-flow.md` |
| Bug fix | `server/docs/debugging-notes.md`, `ai-prompts/debugging.md` |
| Code review | `ai-prompts/code-review.md`, `design-notes.md` |

---

## Git Instructions for Cursor

```
Branch:  cursor/<ticket>-<short-summary>
Main:    protected — no direct pushes
Commits: feat: | fix: | test: | docs:
```

Cloud Agents must work on a separate branch per workspace rules.

---

## What Cursor Should Do

- Follow existing patterns — match naming, folder structure, error handling
- Keep diffs minimal — no unrelated refactors
- Add integration tests for backend behavior changes
- Run `cd server && npm test` after server changes
- Update `api-contract.md` when API shape changes
- Handle all UI states: loading, empty, success, error

---

## What Cursor Should NOT Do

| Avoid | Reason |
|-------|--------|
| Change status via PUT | Use PATCH `/api/tickets/:id/status` |
| Add Redux/Zustand | Context + useReducer only |
| Raw `fetch` or hardcoded API URLs | Use `client/src/services/api.js` |
| Skip tests for workflow changes | 12 transition tests are critical |
| Add auth without explicit request | Out of MVP scope |
| Commit `.env` or secrets | Security |
| Push to `main` | Branch protection |

---

## Verification Before Done

```bash
cd server && npm test
cd client && npm run build    # UI changes
```

Check against `acceptance-criteria.md` — Cursor Verification Checklist section.

---

## Troubleshooting Cursor Sessions

| Issue | Action |
|-------|--------|
| Agent changes wrong files | `@` exact paths; restate scope in prompt |
| API 500 in browser | Backend not running — `cd server && npm run dev` |
| Proxy ECONNREFUSED | Start backend on port 5000 |
| Tests fail after AI edit | `@server/tests/tickets.test.js` — ask to fix regressions |
| Status filter 400 | Check `cleanParams` and `checkFalsy` validators |

See `server/docs/debugging-notes.md` for known issues.

---

## Related Paths

```
.cursor/rules/project-rules.mdc     # Auto-applied rules
ai-prompts/                         # Phase prompts
tool-specific/cursor-workflow/      # This workflow pack
README.md                           # Setup
api-contract.md                     # API spec
server/docs/final-ai-usage-summary.md  # How AI built STMS
```
