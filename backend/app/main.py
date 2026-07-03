from fastapi import FastAPI

app = FastAPI(title="TodoApp")


@app.get("/health")
def health_check():
    return {"status": "ok"}
