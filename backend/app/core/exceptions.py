class AppError(Exception):
    """Base class for domain (business-level) errors."""


class EmailAlreadyExistsError(AppError):
    """Raised when signing up with an email that is already registered."""


class UsernameAlreadyExistsError(AppError):
    """Raised when signing up with a username that is already taken."""


class InvalidCredentialsError(AppError):
    """Raised when sign-in email/password do not match."""


class InactiveUserError(AppError):
    """Raised when an authenticated user's account is disabled."""
