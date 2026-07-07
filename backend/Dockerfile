# Backend image: FastAPI app managed with uv
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app

# Install dependencies first so this layer is cached unless deps change.
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# Copy the application code (and alembic config/migrations).
COPY . .

EXPOSE 8090

# On startup: apply migrations, then serve the API on 0.0.0.0:8090.
CMD ["sh", "-c", ".venv/bin/alembic upgrade head && .venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8090"]
