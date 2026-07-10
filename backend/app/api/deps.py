from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User
from app.repositories.todo_repository import TodoRepository
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.services.todo_service import TodoService

DbSession = Annotated[AsyncSession, Depends(get_db)]


def get_user_repository(session: DbSession) -> UserRepository:
    return UserRepository(session)


UserRepositoryDep = Annotated[UserRepository, Depends(get_user_repository)]


def get_auth_service(user_repository: UserRepositoryDep) -> AuthService:
    return AuthService(user_repository)


AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]


def get_todo_repository(session: DbSession) -> TodoRepository:
    return TodoRepository(session)


TodoRepositoryDep = Annotated[TodoRepository, Depends(get_todo_repository)]


def get_todo_service(todo_repository: TodoRepositoryDep) -> TodoService:
    return TodoService(todo_repository)


TodoServiceDep = Annotated[TodoService, Depends(get_todo_service)]

# auto_error=False so we can return a consistent 401 for missing/invalid tokens.
bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(bearer_scheme)
    ],
    user_repository: UserRepositoryDep,
) -> User:
    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if credentials is None:
        raise invalid_credentials

    try:
        payload = decode_access_token(credentials.credentials)
    except jwt.PyJWTError:
        raise invalid_credentials

    user_id = payload.get("sub")
    if user_id is None:
        raise invalid_credentials

    user = await user_repository.get_by_id(int(user_id))
    if user is None:
        raise invalid_credentials
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled",
        )

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
