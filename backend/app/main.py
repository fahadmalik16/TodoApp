from fastapi import FastAPI

from app.api.routes import auth, todos

app = FastAPI(title="TodoApp")

app.include_router(auth.router)
app.include_router(todos.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
