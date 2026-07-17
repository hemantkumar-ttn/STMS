# Debugging Notes

## Common Issues and Fixes

### 1. MongoDB Connection Refused

**Symptom:**
```
Failed to start server: connect ECONNREFUSED 127.0.0.1:27017
```

**Cause:** MongoDB is not running.

**Fix:**
```bash
sudo systemctl start mongod
# or
docker start mongodb
```

**Verify:**
```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

---

### 2. Frontend API 500 — Proxy Connection Refused

**Symptom (Vite terminal):**
```
http proxy error: /api/users
Error: connect ECONNREFUSED 127.0.0.1:5000
```

**Cause:** Backend server is not running.

**Fix:**
```bash
cd server && npm run dev
```

**Verify:**
```bash
curl http://localhost:5000/api/health
```

---

### 3. Invalid Status Filter on Dashboard

**Symptom:**
```json
{ "success": false, "message": "Invalid status filter" }
```

**Cause:** Frontend sent `status=` (empty string). express-validator treated it as present but invalid.

**Fix applied:**
- Backend: `query('status').optional({ checkFalsy: true })` in `validators.js`
- Frontend: `cleanParams()` strips empty values in `api.js`

**Verify:**
```bash
curl "http://localhost:5000/api/tickets?status="
# Should return all tickets with 200
```

---

### 4. Invalid Status Transition

**Symptom:**
```json
{
  "success": false,
  "message": "Invalid status transition from \"Open\" to \"Resolved\". Allowed: In Progress, Cancelled."
}
```

**Cause:** Attempted workflow jump not allowed by business rules.

**Debug:**
1. Check current ticket status: `GET /api/tickets/:id`
2. Review allowed transitions in `src/utils/statusTransitions.js`
3. Use `PATCH /api/tickets/:id/status` (not `PUT`)

---

### 5. Status Change via PUT Blocked

**Symptom:**
```json
{
  "success": false,
  "message": "Use PATCH /api/tickets/:id/status to change ticket status"
}
```

**Cause:** By design — `PUT` updates fields only, not workflow status.

**Fix:** Use the dedicated status endpoint:
```bash
curl -X PATCH http://localhost:5000/api/tickets/:id/status \
  -H "Content-Type: application/json" \
  -d '{"status": "In Progress"}'
```

---

### 6. CastError — Invalid ObjectId

**Symptom:**
```json
{ "success": false, "message": "Invalid id: notanid" }
```

**Cause:** Route param is not a valid MongoDB ObjectId.

**Debug:** Ensure IDs are 24-character hex strings from seed output or API responses.

---

### 7. Jest Cleanup Failure

**Symptom:**
```
Cannot cleanup because "instance.mongodProcess" is still defined
```

**Cause:** mongodb-memory-server process not fully stopped in sandboxed environment.

**Fix applied in `tests/setup.js`:**
```javascript
await mongoServer.stop({ doCleanup: true, force: true });
```

**Workaround:** Run tests outside sandbox or with full permissions.

---

### 8. Text Search Returns No Results

**Symptom:** `GET /api/tickets?search=keyword` returns empty array.

**Cause:** Text index may not exist if tickets were created before index was defined.

**Fix:**
```bash
# Re-seed database
npm run seed
```

Or manually in mongosh:
```javascript
db.tickets.createIndex({ title: "text", description: "text" })
```

---

## Debugging Tools

### Server Logs

Errors are logged in non-test environments:
```
[Error] 400 - Invalid status filter
```

Set `NODE_ENV=development` to include stack traces in API responses.

### curl Examples

```bash
# List all tickets
curl -s http://localhost:5000/api/tickets | jq .

# Filter by status
curl -s "http://localhost:5000/api/tickets?status=Open" | jq .

# Search
curl -s "http://localhost:5000/api/tickets?search=login" | jq .

# Get ticket with comments
curl -s http://localhost:5000/api/tickets/<id> | jq .

# Change status
curl -s -X PATCH http://localhost:5000/api/tickets/<id>/status \
  -H "Content-Type: application/json" \
  -d '{"status":"In Progress"}' | jq .
```

### MongoDB Inspection

```bash
mongosh stms

db.users.find().pretty()
db.tickets.find().pretty()
db.comments.find().pretty()
```

### Swagger UI

Interactive testing at `http://localhost:5000/api/docs` — useful for exploring request/response shapes without writing curl commands.

## Error Response Format

All API errors follow:

```json
{
  "success": false,
  "message": "Human-readable description"
}
```

In development, `stack` is included for 500 errors.
