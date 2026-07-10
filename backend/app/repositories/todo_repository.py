from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.todo import Todo


class TodoRepository:
    """Data-access layer for Todo rows, always scoped by owner (user_id)."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(
        self,
        user_id: int,
        title: str,
        description: str | None,
        is_completed: bool,
    ) -> Todo:
        todo = Todo(
            user_id=user_id,
            title=title,
            description=description,
            is_completed=is_completed,
        )
        self.session.add(todo)
        await self.session.commit()
        await self.session.refresh(todo)
        return todo

    async def get_by_id(self, todo_id: int, user_id: int) -> Todo | None:
        result = await self.session.execute(
            select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def list_by_user(self, user_id: int) -> list[Todo]:
        result = await self.session.execute(
            select(Todo)
            .where(Todo.user_id == user_id)
            .order_by(Todo.created_at.desc())
        )
        return list(result.scalars().all())

    async def update(self, todo: Todo, fields: dict[str, Any]) -> Todo:
        for key, value in fields.items():
            setattr(todo, key, value)
        await self.session.commit()
        await self.session.refresh(todo)
        return todo

    async def delete(self, todo: Todo) -> None:
        await self.session.delete(todo)
        await self.session.commit()
