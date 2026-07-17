# Support Ticket Management System (STMS)

A full-stack MERN application for managing support tickets with status workflow enforcement, comments, search, and filtering.

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, Vite, React Router, Axios, Tailwind CSS |
| Backend    | Node.js, Express.js                             |
| Database   | MongoDB with Mongoose                           |
| Validation | express-validator                               |
| Testing    | Jest + Supertest                                |
| API Docs   | Swagger UI at `/api/docs`                       |

## Project Structure

```
STMS/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context API state
│   │   ├── pages/          # Route pages
│   │   ├── services/       # Axios API layer
│   │   └── utils/          # Constants and helpers
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # DB and Swagger config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Validation, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   ├── seed/           # Database seed script
│   │   └── utils/          # Status transition logic
│   ├── tests/              # Integration tests
│   └── package.json
└── README.md
```

## Prerequisites

- **Node.js** >= 18
- **MongoDB** >= 6 (running locally or a connection URI)

## Setup

### 1. Clone and install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure environment variables

```bash
# Server
cd ../server
cp .env.example .env
# Edit .env if your MongoDB URI differs from the default

# Client (optional — defaults work with Vite proxy)
cd ../client
cp .env.example .env
```

**Server `.env` variables:**

| Variable     | Default                              | Description          |
|--------------|--------------------------------------|----------------------|
| PORT         | 5000                                 | API server port      |
| MONGODB_URI  | mongodb://localhost:27017/stms       | MongoDB connection   |
| NODE_ENV     | development                          | Environment          |

### 3. Seed the database

Make sure MongoDB is running, then:

```bash
cd server
npm run seed
```

This creates 5 sample users, 6 tickets, and 4 comments.

### 4. Start the application

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Swagger Docs:** http://localhost:5000/api/docs

## API Endpoints

### Tickets

| Method | Endpoint                    | Description                    |
|--------|-----------------------------|--------------------------------|
| GET    | `/api/tickets`              | List tickets (search & filter) |
| GET    | `/api/tickets/:id`          | Get ticket with comments       |
| POST   | `/api/tickets`              | Create ticket                  |
| PUT    | `/api/tickets/:id`          | Update ticket fields           |
| PATCH  | `/api/tickets/:id/status`   | Change ticket status           |
| DELETE | `/api/tickets/:id`          | Delete ticket                  |

**Query parameters for GET `/api/tickets`:**
- `search` — keyword search on title/description
- `status` — filter by status (Open, In Progress, Resolved, Closed, Cancelled)
- `page`, `limit` — pagination

### Comments

| Method | Endpoint                              | Description     |
|--------|---------------------------------------|-----------------|
| GET    | `/api/tickets/:ticketId/comments`     | List comments   |
| POST   | `/api/tickets/:ticketId/comments`     | Add comment     |

### Users

| Method | Endpoint          | Description    |
|--------|-------------------|----------------|
| GET    | `/api/users`      | List all users |
| GET    | `/api/users/:id`  | Get user by ID |

## Status Transitions

The system enforces a strict status workflow:

```
Open ──────────► In Progress ──► Resolved ──► Closed
  │                    │
  └────► Cancelled ◄───┘
```

| From          | Allowed Transitions       |
|---------------|---------------------------|
| Open          | In Progress, Cancelled    |
| In Progress   | Resolved, Cancelled       |
| Resolved      | Closed                    |
| Closed        | (terminal)                |
| Cancelled     | (terminal)                |

Invalid transitions return HTTP 400 with a descriptive error message.

## Running Tests

```bash
cd server
npm test
```

Tests use an in-memory MongoDB instance (no external DB required). Coverage includes:
- All valid status transitions
- All invalid status transitions (including terminal states)
- Ticket CRUD operations
- Search and filter
- Comment creation

## Frontend Features

- **Dashboard** — ticket list with search and status filter
- **Create Ticket** — form with priority and assignment
- **Edit Ticket** — update title, description, priority, assignee
- **Ticket Details** — view info, change status, add comments, delete
- **State Management** — React Context API with useReducer
- **UI States** — loading spinners, empty states, success/error alerts

## Scripts Reference

### Server

| Script       | Command          | Description              |
|--------------|------------------|--------------------------|
| Start        | `npm start`      | Production server        |
| Dev          | `npm run dev`    | Dev server with nodemon  |
| Seed         | `npm run seed`   | Populate sample data     |
| Test         | `npm test`       | Run integration tests    |

### Client

| Script       | Command          | Description              |
|--------------|------------------|--------------------------|
| Dev          | `npm run dev`    | Vite dev server          |
| Build        | `npm run build`  | Production build         |
| Preview      | `npm run preview`| Preview production build |

## License

MIT
