# Server Setup Notes

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | >= 18 |
| npm | >= 9 |
| MongoDB | >= 6 (local or remote URI) |

## Initial Setup

```bash
cd server
npm install
cp .env.example .env
```

## Environment Variables

**File:** `.env`

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | HTTP port for Express server |
| `MONGODB_URI` | `mongodb://localhost:27017/stms` | MongoDB connection string |
| `NODE_ENV` | `development` | Environment (`development`, `test`, `production`) |

## Starting MongoDB

### systemd (Ubuntu/Debian)

```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

### Docker

```bash
docker run -d --name mongodb -p 27017:27017 mongo:7
```

## Seed Database

```bash
npm run seed
```

Creates:
- 5 users (admin, agents, end users)
- 6 tickets (various statuses and priorities)
- 4 comments

Sample output includes user ObjectIds for frontend testing.

## Running the Server

```bash
# Development (nodemon — auto-restart on file changes)
npm run dev

# Production
npm start
```

**Expected output:**
```
MongoDB connected successfully
Server running on port 5000
API docs available at http://localhost:5000/api/docs
```

## Verify Installation

```bash
# Health check
curl http://localhost:5000/api/health

# List users
curl http://localhost:5000/api/users

# List all tickets
curl http://localhost:5000/api/tickets
```

## Project Structure

```
server/
├── src/
│   ├── index.js              # Entry point
│   ├── app.js                # Express app configuration
│   ├── config/
│   │   ├── db.js             # MongoDB connection
│   │   └── swagger.js        # Swagger/OpenAPI spec
│   ├── controllers/
│   │   ├── ticketController.js
│   │   ├── commentController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── errorHandler.js   # Centralized error handling
│   │   ├── validate.js       # express-validator runner
│   │   └── validators.js     # Validation rule definitions
│   ├── models/
│   │   ├── User.js
│   │   ├── Ticket.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── ticketRoutes.js
│   │   ├── commentRoutes.js
│   │   └── userRoutes.js
│   ├── seed/
│   │   └── seed.js
│   └── utils/
│       └── statusTransitions.js
├── tests/
│   ├── setup.js
│   └── tickets.test.js
├── .env
├── .env.example
└── package.json
```

## NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `nodemon src/index.js` | Development server with hot reload |
| `start` | `node src/index.js` | Production server |
| `seed` | `node src/seed/seed.js` | Populate database with sample data |
| `test` | `jest --runInBand --forceExit` | Run integration tests |

## Frontend Integration

The React client (Vite) proxies `/api` requests to `http://localhost:5000`. Both servers must run simultaneously:

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

## Common Setup Issues

| Issue | Solution |
|-------|----------|
| `MONGODB_URI is not defined` | Create `.env` from `.env.example` |
| `connect ECONNREFUSED 127.0.0.1:27017` | Start MongoDB service |
| Port 5000 already in use | Change `PORT` in `.env` or kill existing process |
| Seed fails with duplicate email | Run seed again — it clears data first |
| Tests fail with mongod cleanup error | Run with full permissions; `setup.js` uses `force: true` on stop |

## Swagger API Docs

Once the server is running:

```
http://localhost:5000/api/docs
```

Interactive documentation for all ticket, comment, and user endpoints.
