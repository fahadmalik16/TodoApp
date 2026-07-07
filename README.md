# TodoApp

A full-stack To-Do application built from scratch as a learning project — FastAPI backend, Next.js frontend, JWT authentication, and PostgreSQL.

## Features

- Sign up and sign in with JWT-based authentication
- Automatic sign-out on token expiry (proactive timer + reactive 401 handling)
- Full to-do CRUD (create, list, get, update, delete), scoped per user
- Users only ever see and modify their own to-dos
- Interactive API docs (Swagger UI) out of the box

## Tech Stack

**Backend**
- Python 3.12, FastAPI
- PostgreSQL with SQLAlchemy (async) ORM
- Alembic for database migrations
- PyJWT + bcrypt for authentication
- pytest, pytest-asyncio, httpx for testing
- uv for dependency management

**Frontend**
- Next.js (App Router) with TypeScript
- Tailwind CSS

**Infrastructure**
- Docker Compose (planned) — database + migrations + server on port 8090

## Architecture

The backend follows a layered architecture (SOLID):

```
Presentation  → api/ (routes)   + schemas/ (Pydantic request/response)
Business      → services/       (rules & orchestration)
Data          → repositories/   (DB access) + models/ (ORM tables)
Cross-cutting → core/           (config, security/JWT, exceptions)
Plumbing      → db/             (engine, session)
```

Rule: each layer only calls the one below it (`route → service → repository → model/DB`).
See [ARCHITECTURE.md](ARCHITECTURE.md) for a detailed walkthrough of the sign-up flow.

## Project Structure

```
TodoApp/
├── backend/            FastAPI application
│   ├── app/
│   │   ├── api/        routes + dependency wiring
│   │   ├── core/       config, security, exceptions
│   │   ├── db/         engine & session
│   │   ├── models/     SQLAlchemy models
│   │   ├── repositories/
│   │   ├── schemas/    Pydantic schemas
│   │   └── services/   business logic
│   ├── alembic/        migrations
│   └── tests/          pytest suite
├── frontend/           Next.js application
│   └── src/
│       ├── app/        pages (signin, signup, todos)
│       ├── components/ Nav, TodoItem, icons
│       ├── context/    AuthContext
│       └── lib/        API client, auth helpers, types
├── ARCHITECTURE.md
└── Info.md             requirements & decisions log
```

## Getting Started

The app is being containerized. Once complete, the whole stack will run with:

```bash
docker compose up
```

This will start PostgreSQL, run the database migrations, and serve the API on
`http://localhost:8090`.

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | – | Create an account |
| `POST` | `/auth/signin` | – | Sign in, returns a JWT |
| `GET` | `/auth/me` | ✓ | Current user |
| `GET` | `/todos` | ✓ | List the user's todos |
| `POST` | `/todos` | ✓ | Create a todo |
| `GET` | `/todos/{id}` | ✓ | Get one todo |
| `PATCH` | `/todos/{id}` | ✓ | Update a todo (partial) |
| `DELETE` | `/todos/{id}` | ✓ | Delete a todo |

Interactive docs are available at `/docs` (Swagger UI) when the server is running.

## Project Status

| Area | Status |
|---|---|
| Backend (auth + todos) | ✅ Done |
| Database migrations (Alembic) | ✅ Done |
| Frontend (Next.js UI) | ✅ Done |
| Session expiry handling | ✅ Done |
| Integration tests | ✅ Done |
| Docker Compose | 🚧 In progress |
