Basic todo application

Follow SOLID principles and layered architechture

Use Postgres as the database and SQLAlchemy as ORM.

using Python and Fast API. 

Use database migration to setup schema

The requirements are:

Let users sign up and sign in.
Implement JWT-based authentication.
The application should let users sign up, sign in, and then let them create, update, list, get, and delete to-dos.
The application should be containerized. 
Write a Docker-Compose file such that when it runs, it spins up the database, runs the migrations, and the server starts running on port 8090. All the APIs should then be accessible on http://localhost:8090

Basic frontend next js (react or typescript)


Dependencies:
fast api, 
uvicorn
sqlalchemy (ORM) ,
alembic for migrations, 
psycopg (v3) as the psql driver (handles both async app + sync alembic),
pydantic and pydantic settings for data validation, 
email-validator for EmailStr validation (required by pydantic's EmailStr), 
bcrypt for pass hashing, 
pyjwt for jwt,
pytest and pytest-asyncio, httpx async for testing. 

Arch:
app/
  api/            → Presentation: routes
  schemas/        → Presentation: request/response validation (Pydantic)
  services/       → Business: rules & orchestration
  repositories/   → Data: DB access
  models/         → Data: SQLAlchemy table definitions - they are defining the schemas
  core/           → cross-cutting: config, security/JWT helpers (not a tier, just shared infra)
  db/             → DB engine/session setup


Frontend:
Stack decisions:
- Next.js (App Router) — file-based routing, e.g. app/signin/page.tsx -> /signin
- TypeScript — typed JS for safer code
- Tailwind CSS — utility-class styling (industry standard with Next.js)
- Talks to backend over HTTP; JWT stored in browser (localStorage), sent as
  Authorization: Bearer <token>. Client-side signout (clears token).
- Backend needs CORS enabled to allow the frontend origin (localhost:3000).

Scope: signup page, signin page, todos page (list/create/toggle/edit/delete), signout.

Structure: (to be added later once scaffolded)
