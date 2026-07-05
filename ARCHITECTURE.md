# Backend Architecture — Sign-up Flow (Mental Map / RFC)

A detailed trace of ONE request — `POST /auth/signup` — through every file,
class, and function it touches. Read alongside `Info.md`.

Request body: `{ "username", "email", "password" }`

---

## The players — in execution order

| # | File | Class / function | One-line purpose |
|---|------|------------------|------------------|
| 1 | `app/main.py` | `app` (FastAPI), `include_router(auth.router)` | App entrypoint; mounts the auth routes (at startup). |
| 2 | `app/schemas/user.py` | `UserCreate` | Input contract: validates username/email/password first (else 422). |
| 3a | `app/api/deps.py` | `get_db` / `DbSession` | Provides a DB session per request. |
| 3b | `app/api/deps.py` | `get_user_repository` / `UserRepositoryDep` | Builds a `UserRepository` bound to that session. |
| 3c | `app/api/deps.py` | `get_auth_service` / `AuthServiceDep` | Builds an `AuthService` bound to that repository. |
| 4 | `app/api/routes/auth.py` | `router` (APIRouter, prefix `/auth`) + `signup(data, service)` | The endpoint body: call service → return `UserRead`; map errors to HTTP. |
| 5 | `app/services/auth_service.py` | `AuthService.signup(data)` | Business rules: unique email/username, hash password, create user. |
| 6 | `app/repositories/user_repository.py` | `UserRepository.get_by_email(email)` | Lookup to enforce unique email. |
| 6→ | `app/core/exceptions.py` | `EmailAlreadyExistsError` | If email taken → raised here; route turns it into HTTP 409. |
| 7 | `app/repositories/user_repository.py` | `UserRepository.get_by_username(username)` | Lookup to enforce unique username. |
| 7→ | `app/core/exceptions.py` | `UsernameAlreadyExistsError` | If username taken → raised here; route turns it into HTTP 409. |
| 8 | `app/core/security.py` | `hash_password(plain)` | One-way bcrypt hash of the password. |
| 9 | `app/repositories/user_repository.py` | `UserRepository.create(username, email, hashed_password)` | Inserts the new user row and returns it. |
| 10 | `app/models/user.py` | `User` | SQLAlchemy model mapped to the `users` table (the INSERT). |
| 10 | `app/db/session.py` | `AsyncSessionLocal`, `engine`, `get_db` | The async session/engine that runs the INSERT. |
| 10 | `app/core/config.py` | `settings.database_url` | Supplies the DB URL used to build the engine. |
| 11 | `app/schemas/user.py` | `UserRead` | Output contract (runs last): serialize response — **no password**. |

---

## Step-by-step trace

```
CLIENT ── POST /auth/signup {username, email, password} ──►

1. app/api/routes/auth.py :: signup(data: UserCreate, service: AuthServiceDep)
   • FastAPI parses the JSON body into schemas.UserCreate.
       - UserCreate validates: username 3–50, email is real, password 8–72.
       - invalid → FastAPI returns 422 automatically (code below never runs).
   • To build `service`, FastAPI resolves the dependency chain (step 2).
   • Calls  await service.signup(data)          (step 3)
   • On success: returns the User; FastAPI serializes it via UserRead
     (response_model=UserRead) → strips hashed_password, sets 201.
   • On EmailAlreadyExistsError    → raise HTTPException 409.
   • On UsernameAlreadyExistsError → raise HTTPException 409.

2. app/api/deps.py  (dependency injection, built fresh per request)
       get_db()                         → AsyncSession            (db/session.py)
         └─ get_user_repository(session) → UserRepository(session)
              └─ get_auth_service(repo)   → AuthService(repo)
   • Result: `service` is AuthService(UserRepository(AsyncSession)).

3. app/services/auth_service.py :: AuthService.signup(data)
   a. await user_repository.get_by_email(data.email)
        → if a user exists: raise EmailAlreadyExistsError   (→ 409)
   b. await user_repository.get_by_username(data.username)
        → if a user exists: raise UsernameAlreadyExistsError (→ 409)
   c. hashed = core.security.hash_password(data.password)    (bcrypt)
   d. return await user_repository.create(
             username=data.username, email=data.email,
             hashed_password=hashed)

4. app/repositories/user_repository.py :: UserRepository.create(...)
   • user = models.User(username, email, hashed_password)
   • session.add(user); await session.commit(); await session.refresh(user)
   • returns the User (now has DB-generated id, created_at, is_active=True).

5. app/models/user.py :: User  +  app/db/session.py
   • User maps to the `users` table; the AsyncSession issues the INSERT
     over the engine built from core.config.settings.database_url.

◄── 201 Created  { id, username, email, is_active, created_at }   (UserRead)
```

---

## Layer summary for this flow

```
Presentation → routes/auth.py (HTTP) + schemas/user.py (contracts)
Business     → services/auth_service.py (rules: uniqueness, hashing)
Data         → repositories/user_repository.py (SQL) + models/user.py (table)
Cross-cutting→ core/security.py (hash), core/exceptions.py (errors),
               core/config.py (settings)
Plumbing     → db/session.py (session/engine)
```

**Golden rule:** each layer only calls the one below it —
`route → service → repository → model/DB`. Domain errors bubble up from the
service and are translated to HTTP status codes only at the route.
