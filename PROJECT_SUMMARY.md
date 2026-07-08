# TodoApp — Project Summary (Source of Truth)

> One-page summary of the entire project — what it is, how it's built, how it runs, and where everything lives. Share this document to bring anyone up to speed.

**Last updated:** 2026-07-07

---

## 1. What it is

A full-stack, multi-user **To-Do application**. Users sign up, sign in, and manage their own private list of to-dos (create, list, get, update, delete). Authentication is JWT-based, data is isolated per user, and the whole stack runs with a single `docker compose up --build`.

## 2. System design

![TodoApp system design](docs/design.png)

*(Editable vector source: [docs/design.svg](docs/design.svg))*

The system is three containers plus a one-shot migration step:

1. **Frontend** — Next.js serves the UI on **:3000**. The browser keeps the JWT in `localStorage` and calls the backend directly with an `Authorization: Bearer` header.
2. **Backend** — FastAPI on **:8090** owns all business logic and data access.
3. **PostgreSQL** — the only persistent store. **Alembic** migrations run as a one-shot container before the backend starts, so the schema is always in place.

## 3. Tech stack

| Area | Choices |
|---|---|
| Backend | Python 3.12, FastAPI, SQLAlchemy 2.0 (async, psycopg v3), Alembic, Pydantic v2, PyJWT + bcrypt, uv |
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS |
| Database | PostgreSQL |
| Testing | pytest, pytest-asyncio, httpx (async client) |
| Infrastructure | Docker Compose (db → migrations → backend :8090 → frontend :3000) |

## 4. Backend architecture

Layered architecture following SOLID; each layer only calls the one below it:

```
route (api/) → service (services/) → repository (repositories/) → model/DB (models/, db/)
```

| Layer | Directory | Responsibility |
|---|---|---|
| Presentation | `backend/app/api/`, `backend/app/schemas/` | HTTP routes, dependency wiring, Pydantic request/response contracts |
| Business | `backend/app/services/` | Rules and orchestration (uniqueness checks, password hashing, ownership) |
| Data | `backend/app/repositories/`, `backend/app/models/` | DB queries and SQLAlchemy table definitions |
| Cross-cutting | `backend/app/core/` | Settings, JWT + bcrypt helpers, domain exceptions |
| Plumbing | `backend/app/db/` | Async engine and per-request session |

Domain errors (e.g. `EmailAlreadyExistsError`) are raised in services and translated to HTTP status codes only at the route layer. Dependencies are injected per request: `get_db → repository → service`.

## 5. Data model

Two tables, one relationship:

**`users`** — `id`, `username` (unique), `email` (unique), `hashed_password` (bcrypt), `is_active`, `created_at`, `updated_at`

**`todos`** — `id`, `title` (≤255), `description` (optional), `is_completed` (default false), `user_id` → `users.id` (indexed, `ON DELETE CASCADE`), `created_at`, `updated_at`

Deleting a user deletes their todos. Every todo query is scoped by `user_id`, so users can never see or modify each other's items.

## 6. API surface

Base URL `http://localhost:8090`, interactive docs at `/docs` (Swagger UI).

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | – | Create an account (409 on duplicate email/username) |
| `POST` | `/auth/signin` | – | Sign in, returns a JWT access token |
| `GET` | `/auth/me` | ✓ | Current user |
| `GET` | `/todos` | ✓ | List the user's todos |
| `POST` | `/todos` | ✓ | Create a todo |
| `GET` | `/todos/{id}` | ✓ | Get one todo (404 if not yours) |
| `PATCH` | `/todos/{id}` | ✓ | Partial update |
| `DELETE` | `/todos/{id}` | ✓ | Delete |

**Auth flow:** signin verifies the bcrypt hash and issues an HS256 JWT (default 30-minute lifetime). Protected routes decode the token via a FastAPI dependency and load the current user. The frontend signs the user out proactively when the token expires (timer) and reactively on any 401.

## 7. Frontend

Three pages under `frontend/src/app/` — `/signin`, `/signup`, `/todos` (list, create, toggle complete, inline edit, delete) — plus client-side signout. Shared pieces: `AuthContext` (session state), `lib/api.ts` (typed API client that attaches the bearer token), `components/` (Nav, TodoItem, icons). CORS on the backend allows the frontend origin (`http://localhost:3000` by default).

## 8. Repository layout

```
TodoApp/
├── backend/               FastAPI app (layered: api / services / repositories / models / core / db)
│   ├── alembic/           migrations (users + todos tables)
│   ├── tests/             pytest suite (integration: auth, todos, health)
│   └── Dockerfile
├── frontend/              Next.js app (src/app pages, components, context, lib)
│   └── Dockerfile
├── docker-compose.yml     db + migrations + backend + frontend
├── docs/design.svg|png    system design diagram (this doc's image)
├── README.md              user-facing readme (setup, config, endpoints)
├── ARCHITECTURE.md        deep-dive: full trace of POST /auth/signup through every layer
├── GETSTARTED.md          getting-started guide
└── Info.md                original requirements & decisions log
```

## 9. Running it

Prerequisites: Git and Docker (Compose v2). Everything else runs in containers.

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend (UI) | http://localhost:3000 |
| Backend API | http://localhost:8090 |
| Swagger docs | http://localhost:8090/docs |

Stop with `docker compose down` (add `-v` to wipe the database).

## 10. Configuration

Set via environment variables; `docker-compose.yml` provides dev-only defaults.

| Variable | Purpose | Default |
|---|---|---|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Database credentials | `todo_user` / *(set your own)* / `todo_db` |
| `JWT_SECRET_KEY` | Signs JWTs | **Required — no safe default** |
| `JWT_ALGORITHM` | Signing algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime | `30` |
| `CORS_ORIGINS` | Allowed frontend origins | `http://localhost:3000` |

⚠️ For any real deployment, override `JWT_SECRET_KEY` and the DB password (e.g. `python -c "import secrets; print(secrets.token_hex(32))"`).

## 11. Testing

Backend integration tests cover health, the auth flows (5 tests), and full todo CRUD including ownership isolation (7 tests):

```bash
cd backend
uv sync
uv run pytest
```

## 12. Key decisions

- **Layered architecture over quick-and-flat** — routes never touch the DB; services never speak HTTP. Keeps each concern testable and swappable.
- **Async end-to-end** — async SQLAlchemy + psycopg v3 (same driver serves the async app and sync Alembic).
- **JWT in localStorage with dual expiry handling** — simple client-side sessions; proactive timer plus reactive 401 handling covers both expiry paths.
- **Migrations as a compose step** — the schema is applied before the API starts; no manual setup.
- **uv for Python dependency management** — fast, lockfile-based installs.

## 13. Further reading

- [README.md](README.md) — setup and reference
- [ARCHITECTURE.md](ARCHITECTURE.md) — request-level trace of the signup flow (great for onboarding)
- [GETSTARTED.md](GETSTARTED.md) — getting-started guide
- [Info.md](Info.md) — original requirements and stack decisions
