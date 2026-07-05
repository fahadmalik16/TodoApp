from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, TodoServiceDep
from app.core.exceptions import TodoNotFoundError
from app.schemas.todo import TodoCreate, TodoRead, TodoUpdate

router = APIRouter(prefix="/todos", tags=["todos"])


@router.post("", response_model=TodoRead, status_code=status.HTTP_201_CREATED)
async def create_todo(
    data: TodoCreate, current_user: CurrentUser, service: TodoServiceDep
) -> TodoRead:
    return await service.create_todo(current_user.id, data)


@router.get("", response_model=list[TodoRead])
async def list_todos(
    current_user: CurrentUser, service: TodoServiceDep
) -> list[TodoRead]:
    return await service.list_todos(current_user.id)


@router.get("/{todo_id}", response_model=TodoRead)
async def get_todo(
    todo_id: int, current_user: CurrentUser, service: TodoServiceDep
) -> TodoRead:
    try:
        return await service.get_todo(todo_id, current_user.id)
    except TodoNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found"
        )


@router.patch("/{todo_id}", response_model=TodoRead)
async def update_todo(
    todo_id: int,
    data: TodoUpdate,
    current_user: CurrentUser,
    service: TodoServiceDep,
) -> TodoRead:
    try:
        return await service.update_todo(todo_id, current_user.id, data)
    except TodoNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found"
        )


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(
    todo_id: int, current_user: CurrentUser, service: TodoServiceDep
) -> None:
    try:
        await service.delete_todo(todo_id, current_user.id)
    except TodoNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found"
        )
