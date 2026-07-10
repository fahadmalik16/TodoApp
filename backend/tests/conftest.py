import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from app.core.config import settings
from app.db.session import get_db
from app.main import app

# Run tests against the existing database, but with NullPool so connections
# are never reused across tests (each async test runs in its own event loop).
test_engine = create_async_engine(settings.database_url, poolclass=NullPool)
TestSessionLocal = async_sessionmaker(
    bind=test_engine, class_=AsyncSession, expire_on_commit=False
)

# A single shared account used by all authenticated tests.
TEST_USER = {
    "username": "tester",
    "email": "tester@example.com",
    "password": "secret123",
}


async def _override_get_db():
    async with TestSessionLocal() as session:
        yield session


@pytest.fixture
async def client():
    app.dependency_overrides[get_db] = _override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest.fixture
async def auth_headers(client):
    """Ensure the shared test account exists, then return auth headers.

    Clears the account's todos both before and after the test, so each test
    starts from a clean slate and leaves no footprint in the database.
    """
    # Create the account if it isn't there yet (ignore 409 on reruns).
    await client.post("/auth/signup", json=TEST_USER)
    resp = await client.post(
        "/auth/signin",
        json={"email": TEST_USER["email"], "password": TEST_USER["password"]},
    )
    headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

    async def clear_todos():
        existing = (await client.get("/todos", headers=headers)).json()
        for todo in existing:
            await client.delete(f"/todos/{todo['id']}", headers=headers)

    await clear_todos()  # clean slate before the test
    yield headers
    await clear_todos()  # remove everything the test created -> no footprint
