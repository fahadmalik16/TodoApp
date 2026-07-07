# TodoApp

A basic full-stack To-Do application, built from scratch as a learning project.

## Overview

- Users can sign up and sign in (JWT-based authentication).
- Authenticated users can create, list, get, update, and delete their own to-dos.
- Backend follows SOLID principles with a layered architecture (routes → services → repositories → database).
- Frontend: basic Next.js (React/TypeScript) app (planned).

## Tech Stack

- **Language:** Python 3.12
- **Framework:** FastAPI
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Migrations:** Alembic
- **Auth:** PyJWT + bcrypt
- **Testing:** pytest, pytest-asyncio, httpx
- **Dependency management:** uv
- **Containerization:** Docker Compose

## Project Status

🚧 Work in progress — set up incrementally.

## Getting Started

Environment setup (Python + dependencies) is done via [uv](https://docs.astral.sh/uv/):

```bash
uv sync
```

Further setup instructions (database, migrations, running the server, Docker Compose) will be added as those pieces are built.
