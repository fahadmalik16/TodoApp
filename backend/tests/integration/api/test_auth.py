async def test_signin_success(client, auth_headers):
    # auth_headers ensures the account exists; verify sign-in returns a token.
    resp = await client.post(
        "/auth/signin",
        json={"email": "tester@example.com", "password": "secret123"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]


async def test_signin_wrong_password(client, auth_headers):
    resp = await client.post(
        "/auth/signin",
        json={"email": "tester@example.com", "password": "wrongpass"},
    )
    assert resp.status_code == 401


async def test_signin_unknown_email(client):
    resp = await client.post(
        "/auth/signin",
        json={"email": "nobody@example.com", "password": "secret123"},
    )
    assert resp.status_code == 401


async def test_me_requires_token(client):
    resp = await client.get("/auth/me")
    assert resp.status_code == 401


async def test_me_with_token(client, auth_headers):
    resp = await client.get("/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["username"] == "tester"
