from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from app.core.config import settings

# bcrypt only uses the first 72 bytes of a password; longer inputs raise an
# error in bcrypt 5.x, so we truncate to stay within that limit.
_BCRYPT_MAX_BYTES = 72


def _to_bcrypt_bytes(password: str) -> bytes:
    return password.encode("utf-8")[:_BCRYPT_MAX_BYTES]


def hash_password(plain_password: str) -> str:
    """Hash a plain-text password for storage (one-way)."""
    hashed = bcrypt.hashpw(_to_bcrypt_bytes(plain_password), bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check a plain-text password against a stored hash."""
    return bcrypt.checkpw(
        _to_bcrypt_bytes(plain_password), hashed_password.encode("utf-8")
    )


def create_access_token(subject: str | int) -> str:
    """Create a signed JWT whose 'sub' claim identifies the user."""
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {
        "sub": str(subject),  # JWT spec requires 'sub' to be a string
        "exp": expire,
    }
    return jwt.encode(
        payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )


def decode_access_token(token: str) -> dict:
    """Verify a JWT's signature and expiry, returning its payload.

    Raises jwt.PyJWTError (e.g. ExpiredSignatureError, InvalidTokenError)
    if the token is invalid or expired.
    """
    return jwt.decode(
        token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
    )
