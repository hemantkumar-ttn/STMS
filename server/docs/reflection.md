# Reflection

## What Went Well

### Architecture Decisions

Separating status transitions into `src/utils/statusTransitions.js` proved valuable early on. Keeping that logic out of the controller made the workflow easy to test and reason about, and the same rules could be mirrored on the frontend for UI button visibility.

The dedicated `PATCH /api/tickets/:id/status` endpoint was the right call. It prevents accidental workflow bypasses through the general update endpoint and makes the API intent clear to consumers.

### Testing Approach

Using mongodb-memory-server eliminated the "works on my machine" problem for tests. Developers and CI can run `npm test` without a local MongoDB instance. The 20 integration tests give confidence in the most critical business rule — status transitions.

### Error Handling

The centralized `AppError` + `errorHandler` pattern kept controllers clean. Every endpoint returns the same `{ success, message }` shape, which simplified frontend error handling to a single Axios interceptor.

## Challenges

### Empty Query Parameter Validation

The "All Statuses" dashboard bug was subtle. An empty `status=` query param passed client-side validation but failed server-side because express-validator's default `.optional()` does not treat empty strings as absent. This required both backend (`checkFalsy: true`) and frontend (`cleanParams()`) fixes.

**Lesson:** Always test the "no filter" case explicitly, not just specific filter values.

### Two-Server Development Setup

The frontend proxy error (`ECONNREFUSED :5000`) confused initial testing because the 500 appeared to come from the API itself. Clear documentation of the two-terminal workflow was needed.

**Lesson:** Document startup order and common proxy errors prominently in setup notes.

### Jest Cleanup in Sandboxed Environments

mongodb-memory-server cleanup failed in restricted environments. Required `force: true` on `stop()` and a guard on Mongoose connection state.

**Lesson:** Test infrastructure needs the same debugging attention as application code.

## What I Would Do Differently

1. **Add authentication earlier** — Even a simple API key or JWT stub would make `createdBy` handling more realistic and prevent trust-boundary issues.

2. **Test user endpoints** — Low effort, would increase coverage and catch regressions on population logic.

3. **Add `ticketId` index on comments** — Minor optimization that costs nothing at schema definition time.

4. **Structured logging** — Replace `console.error` with a logger (pino/winston) for production readiness.

## Skills Demonstrated

- REST API design with workflow enforcement
- Mongoose schema design with text indexes
- Input validation with express-validator
- Integration testing with Jest and Supertest
- Centralized error handling patterns
- Seed data scripting
- Swagger/OpenAPI documentation
- Environment-based configuration

## Overall Assessment

The server meets all stated requirements: CRUD, status transitions, comments, search/filter, validation, error handling, seed data, and integration tests. The codebase is maintainable, follows Express conventions, and is ready for authentication and deployment layers to be added on top.
