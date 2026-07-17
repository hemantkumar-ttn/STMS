# Candidate Information

## Project

**Support Ticket Management System (STMS)**

A full-stack MERN application for creating, tracking, and resolving support tickets with enforced status workflows, comments, search, and filtering.

## Repository Structure

```
STMS/
├── client/          # React 18 + Vite frontend
├── server/          # Node.js + Express backend
└── docs/            # Project documentation (root-level .md files)
```

## Tech Stack Summary

| Area | Technologies |
|------|-------------|
| Frontend | React 18, Vite, React Router, Axios, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Validation | express-validator |
| Testing | Jest, Supertest, mongodb-memory-server |
| API Docs | Swagger UI (`/api/docs`) |

## Key Deliverables

- Complete ticket CRUD with status workflow enforcement
- Comment system on tickets
- Search by keyword and filter by status
- Responsive React dashboard
- MongoDB seed script with sample data
- Integration test suite (20 tests)
- API service layer and reusable UI components
- Centralized error handling and input validation

## How to Run

```bash
# Backend
cd server && npm install && npm run seed && npm run dev

# Frontend (separate terminal)
cd client && npm install && npm run dev
```

- Frontend: http://localhost:3000 (or next available port)
- Backend API: http://localhost:5000/api
- Swagger: http://localhost:5000/api/docs

## Documentation Index

| File | Purpose |
|------|---------|
| `requirements-analysis.md` | Problem statement and functional requirements |
| `acceptance-criteria.md` | Testable success conditions |
| `implementation-plan.md` | Phased build approach |
| `design-notes.md` | Architecture and design decisions |
| `api-contract.md` | REST API specification |
| `data-model.md` | Database schemas and relationships |
| `ui-flow.md` | Frontend screens and navigation |
| `test-strategy.md` | Testing approach and coverage |
| `tool-workflow.md` | Development tools and workflow |

## Assumptions

- No authentication layer — users are seed data; the frontend defaults to the first agent user for demo actions
- Single-tenant deployment (one organization)
- MongoDB runs locally or via a provided connection URI
- English-only UI and API messages
