from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TodoCreate(BaseModel):
    """Input for creating a todo."""

    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    is_completed: bool = False


class TodoUpdate(BaseModel):
    """Input for updating a todo. All fields optional (partial update)."""

    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    is_completed: bool | None = None


class TodoRead(BaseModel):
    """Todo data returned to clients."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    is_completed: bool
    created_at: datetime
    updated_at: datetime
