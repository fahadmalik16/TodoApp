from pydantic import BaseModel


class Token(BaseModel):
    """Sign-in response containing the JWT access token."""

    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """Decoded JWT contents used when validating a token."""

    sub: str | None = None
