from app.core.exceptions import (
    EmailAlreadyExistsError,
    InactiveUserError,
    InvalidCredentialsError,
    UsernameAlreadyExistsError,
)
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.token import Token
from app.schemas.user import UserCreate


class AuthService:
    """Business logic for user sign-up and sign-in."""

    def __init__(self, user_repository: UserRepository) -> None:
        self.user_repository = user_repository

    async def signup(self, data: UserCreate) -> User:
        if await self.user_repository.get_by_email(data.email):
            raise EmailAlreadyExistsError(data.email)
        if await self.user_repository.get_by_username(data.username):
            raise UsernameAlreadyExistsError(data.username)

        return await self.user_repository.create(
            username=data.username,
            email=data.email,
            hashed_password=hash_password(data.password),
        )

    async def authenticate(self, email: str, password: str) -> Token:
        user = await self.user_repository.get_by_email(email)
        # Same error whether the email is unknown or the password is wrong,
        # so we don't leak which accounts exist.
        if user is None or not verify_password(password, user.hashed_password):
            raise InvalidCredentialsError()
        if not user.is_active:
            raise InactiveUserError()

        access_token = create_access_token(subject=user.id)
        return Token(access_token=access_token)
