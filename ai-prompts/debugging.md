# Debugging Prompts — STMS

Use these prompts when diagnosing bugs, errors, or unexpected behavior in STMS.

---

## Project Context

```
STMS runs as two processes:
- Backend: cd server && npm run dev (port 5000)
- Frontend: cd client && npm run dev (port 3000, Vite proxies /api → :5000)

Health check: curl http://localhost:5000/api/health
Swagger: http://localhost:5000/api/docs

Error format: { "success": false, "message": "..." }
Dev stack traces on 500 errors when NODE_ENV=development

Reference: server/docs/debugging-notes.md, tool-workflow.md troubleshooting table
```

---

## General Debug Session

```
Debug this STMS issue: [SYMPTOM / ERROR MESSAGE]

Investigate systematically:
1. Is MongoDB running? (mongosh --eval "db.runCommand({ ping: 1 })")
2. Is backend running on :5000? (curl /api/health)
3. Is frontend proxy reaching backend? (check Vite terminal for ECONNREFUSED)
4. Reproduce via curl against API directly (bypass frontend)
5. Check server terminal for [Error] logs
6. Inspect DB: mongosh stms → db.tickets.find().pretty()

Report: root cause, affected files, and minimal fix.
```

---

## API Error Debug

```
STMS API returned this error:
[PASTE JSON RESPONSE]

Endpoint: [METHOD] [PATH]
Request body/query: [PASTE]

Analyze against:
- server/src/middleware/validators.js (validation failures → 400)
- server/src/utils/statusTransitions.js (invalid transition → 400)
- server/src/middleware/errorHandler.js (CastError, ValidationError)
- api-contract.md (expected request/response)

Explain cause and provide curl command to verify fix.
```

---

## Status Transition Debug

```
Status change failed in STMS.

Current ticket status: [STATUS]
Attempted transition to: [STATUS]
Endpoint used: [PUT or PATCH]

Check:
1. Must use PATCH /api/tickets/:id/status (PUT rejects status changes)
2. Allowed transitions from server/src/utils/statusTransitions.js
3. Terminal states Closed/Cancelled cannot transition
4. Frontend buttons from client/src/utils/constants.js

Provide correct curl command and whether bug is frontend or backend.
```

---

## Frontend Proxy / Network Debug

```
STMS frontend shows [ERROR / BLANK / SPINNER FOREVER].

Debug steps:
1. Vite terminal: look for "http proxy error: /api/..." → backend not running
2. Browser Network tab: request URL, status, response body
3. client/src/services/api.js: interceptor message extraction
4. TicketContext: loading state stuck? error message set?
5. cleanParams(): empty status= causing 400? (should be stripped)

Common fixes:
- cd server && npm run dev
- Restart both terminals after .env change
```

---

## MongoDB / Seed Debug

```
STMS database issue: [DESCRIPTION]

Checks:
- MONGODB_URI in server/.env (default: mongodb://localhost:27017/stms)
- Connection error ECONNREFUSED 127.0.0.1:27017 → start mongod
- Search returns empty: text index missing → npm run seed or createIndex manually
- Stale data after schema change → re-seed

Seed command: cd server && npm run seed
Verify: curl http://localhost:5000/api/tickets
```

---

## Jest Test Failure Debug

```
STMS test failure:
[PASTE JEST OUTPUT]

Common issues:
- mongodb-memory-server cleanup: force stop in tests/setup.js
- Race conditions: tests run --runInBand
- Stale data: afterEach should clear collections
- Wrong endpoint for status change (must be PATCH /status)

Fix test or code with minimal change; re-run cd server && npm test.
```

---

## curl Debug Commands

```
Provide curl commands to debug [SCENARIO] in STMS.

Templates:
# List tickets
curl -s http://localhost:5000/api/tickets | jq .

# Filter + search
curl -s "http://localhost:5000/api/tickets?status=Open&search=login" | jq .

# Get ticket with comments
curl -s http://localhost:5000/api/tickets/<id> | jq .

# Change status
curl -s -X PATCH http://localhost:5000/api/tickets/<id>/status \
  -H "Content-Type: application/json" \
  -d '{"status":"In Progress"}' | jq .

# Create ticket
curl -s -X POST http://localhost:5000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Debug ticket","createdBy":"<userId>"}' | jq .
```

---

## Log Analysis

```
Analyze STMS server logs for: [ISSUE]

Log format: [Error] <statusCode> - <message>
Stack included in API response only when NODE_ENV=development.

Trace error through:
controller → next(error) → errorHandler → response

Identify if operational AppError or unexpected 500; suggest fix location.
```
