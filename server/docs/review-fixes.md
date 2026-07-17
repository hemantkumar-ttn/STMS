# Review Fixes

Fixes applied based on code review findings and issues discovered during development and testing.

## Fix 1: Empty Status Filter Returns 400

**Issue:** Dashboard with "All Statuses" selected sent `GET /api/tickets?status=&search=`, causing `Invalid status filter` error.

**Root cause:** `express-validator`'s `.optional()` treats empty string as a present but invalid value.

**Files changed:**
- `src/middleware/validators.js`
- `client/src/services/api.js` (frontend companion fix)

**Before:**
```javascript
query('status').optional().isIn(ALL_STATUSES)
```

**After:**
```javascript
query('status')
  .optional({ checkFalsy: true })
  .isIn(ALL_STATUSES)
```

**Frontend:**
```javascript
const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value != null && value !== '')
  );
```

**Test added:** `returns all tickets when status filter is empty`

---

## Fix 2: Jest MongoDB Memory Server Cleanup

**Issue:** Test suite reported failure on cleanup:
```
Cannot cleanup because "instance.mongodProcess" is still defined
```
Tests passed (19/19) but suite exited with code 1.

**Root cause:** mongodb-memory-server process not fully terminated before `stop()` in sandboxed environments.

**File changed:** `tests/setup.js`

**Before:**
```javascript
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});
```

**After:**
```javascript
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop({ doCleanup: true, force: true });
  }
});
```

**Result:** 20/20 tests pass, exit code 0.

---

## Fix 3: Status Changes Blocked on PUT Endpoint

**Issue:** Review identified risk of status changes bypassing workflow via general update.

**Fix (by design, implemented from start):**
- `updateTicket` controller explicitly rejects status changes:
```javascript
if (req.body.status && req.body.status !== ticket.status) {
  return next(
    new AppError('Use PATCH /api/tickets/:id/status to change ticket status', 400)
  );
}
```

**Verified by:** Integration tests and manual testing.

---

## Fix 4: Frontend Proxy 500 When Backend Down

**Issue:** `http://localhost:3001/api/users` returned 500 when backend was not running.

**Root cause:** Vite proxy `ECONNREFUSED` — not a server bug.

**Resolution:** Documented in `setup-notes.md` and `debugging-notes.md`. Both servers must run.

**No code change required.**

---

## Deferred Fixes (Not Implemented — Out of MVP Scope)

| Finding | Reason Deferred |
|---------|----------------|
| JWT authentication | Explicitly out of scope |
| Rate limiting | Production concern |
| CORS origin restriction | Dev convenience; document for prod |
| Comment `ticketId` index | Performance optimization at scale |
| User endpoint tests | Low risk, read-only |
| Morgan request logging | Nice-to-have |

---

## Verification After Fixes

```bash
cd server
npm test                    # 20 passed
curl "http://localhost:5000/api/tickets?status="  # 200, all tickets
curl http://localhost:5000/api/health             # 200
```

All review fixes verified. No regressions introduced.
