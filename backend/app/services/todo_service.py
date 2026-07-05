from app.core.exceptions import TodoNotFoundError
from app.models.todo import Todo
from app.repositories.todo_repository import TodoRepository
from app.schemas.todo import TodoCreate, TodoUpdate


class TodoService:
    """Business logic for todos. Every operation is scoped to the owner."""

    def __init__(self, todo_repository: TodoRepository) -> None:
        self.todo_repository = todo_repository

    async def create_todo(self, user_id: int, data: TodoCreate) -> Todo:
        return await self.todo_repository.create(
            user_id=user_id,
            title=data.title,
            description=data.description,
            is_completed=data.is_completed,
        )

    async def list_todos(self, user_id: int) -> list[Todo]:
        return await self.todo_repository.list_by_user(user_id)

    async def get_todo(self, todo_id: int, user_id: int) -> Todo:
        todo = await self.todo_repository.get_by_id(todo_id, user_id)
        if todo is None:
            raise TodoNotFoundError(todo_id)
        return todo

    async def update_todo(
        self, todo_id: int, user_id: int, data: TodoUpdate
    ) -> Todo:
        todo = await self.get_todo(todo_id, user_id)
        # Only apply fields the client actually sent (partial update).
        fields = data.model_dump(exclude_unset=True)
        if not fields:
            return todo
        return await self.todo_repository.update(todo, fields)

    async def delete_todo(self, todo_id: int, user_id: int) -> None:
        todo = await self.get_todo(todo_id, user_id)
        await self.todo_repository.delete(todo)
