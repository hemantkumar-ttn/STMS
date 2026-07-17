# PR Description

## Support Ticket Management System — Backend API

### Summary

Implements the Express.js backend for STMS — a REST API for managing support tickets with enforced status workflows, comments, search/filter, and MongoDB persistence.

- Add Mongoose models for User, Ticket, and Comment
- Implement full ticket CRUD with dedicated status transition endpoint
- Enforce status workflow rules server-side with descriptive error messages
- Add comment system with cascade delete on ticket removal
- Implement keyword search (text index) and status filtering
- Add express-validator input validation on all endpoints
- Add centralized error handling with consistent JSON responses
- Add MongoDB seed script with sample data
- Add 20 integration tests (Jest + Supertest + mongodb-memory-server)
- Add Swagger API documentation at `/api/docs`

### Status Workflow

```
Open → In Progress → Resolved → Closed
  │         │
  └→ Cancelled ←┘
```

Invalid transitions return HTTP 400.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | List with search, filter, pagination |
| GET | `/api/tickets/:id` | Get ticket + comments |
| POST | `/api/tickets` | Create ticket |
| PUT | `/api/tickets/:id` | Update fields (not status) |
| PATCH | `/api/tickets/:id/status` | Change status (workflow enforced) |
| DELETE | `/api/tickets/:id` | Delete ticket + comments |
| POST | `/api/tickets/:ticketId/comments` | Add comment |
| GET | `/api/tickets/:ticketId/comments` | List comments |
| GET | `/api/users` | List users (seed data) |
| GET | `/api/users/:id` | Get user by ID |
| GET | `/api/health` | Health check |

### Files Added

```
server/
├── src/
│   ├── index.js
│   ├── app.js
│   ├── config/db.js
│   ├── config/swagger.js
│   ├── controllers/ticketController.js
│   ├── controllers/commentController.js
│   ├── controllers/userController.js
│   ├── middleware/errorHandler.js
│   ├── middleware/validate.js
│   ├── middleware/validators.js
│   ├── models/User.js
│   ├── models/Ticket.js
│   ├── models/Comment.js
│   ├── routes/ticketRoutes.js
│   ├── routes/commentRoutes.js
│   ├── routes/userRoutes.js
│   ├── seed/seed.js
│   └── utils/statusTransitions.js
├── tests/setup.js
├── tests/tickets.test.js
├── .env.example
└── package.json
```

### Test Plan

- [x] `npm test` — 20/20 integration tests pass
- [x] `npm run seed` — populates 5 users, 6 tickets, 4 comments
- [x] `npm run dev` — server starts on port 5000
- [x] `GET /api/health` returns 200
- [x] `GET /api/tickets?status=` returns all tickets (empty filter fix)
- [x] Valid status transitions return 200
- [x] Invalid status transitions return 400 with descriptive message
- [x] Swagger docs accessible at `/api/docs`
- [x] Ticket delete cascades to comments

### Breaking Changes

None — initial implementation.

### Dependencies Added

| Package | Purpose |
|---------|---------|
| express | HTTP server |
| mongoose | MongoDB ODM |
| express-validator | Input validation |
| cors | Cross-origin support |
| dotenv | Environment config |
| swagger-jsdoc, swagger-ui-express | API docs |
| jest, supertest, mongodb-memory-server | Testing (dev) |
| nodemon | Dev hot reload (dev) |

### Related

- Frontend PR: React dashboard consuming this API
- Docs: Root-level `api-contract.md`, `data-model.md`, `test-strategy.md`
