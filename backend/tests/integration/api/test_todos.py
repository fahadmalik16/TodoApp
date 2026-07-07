async def test_todos_require_auth(client):
    resp = await client.get("/todos")
    assert resp.status_code == 401


async def test_create_todo(client, auth_headers):
    resp = await client.post(
        "/todos",
        headers=auth_headers,
        json={"title": "Buy milk", "description": "2 liters"},
    )
    assert resp.status_code == 201
    body = resp.json()
    assert body["title"] == "Buy milk"
    assert body["description"] == "2 liters"
    assert body["is_completed"] is False


async def test_list_todos(client, auth_headers):
    await client.post("/todos", headers=auth_headers, json={"title": "First"})
    await client.post("/todos", headers=auth_headers, json={"title": "Second"})
    resp = await client.get("/todos", headers=auth_headers)
    assert resp.status_code == 200
    titles = [t["title"] for t in resp.json()]
    assert "First" in titles and "Second" in titles
    assert len(resp.json()) == 2


async def test_get_todo(client, auth_headers):
    created = (
        await client.post("/todos", headers=auth_headers, json={"title": "Read book"})
    ).json()
    resp = await client.get(f"/todos/{created['id']}", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["title"] == "Read book"


async def test_get_missing_todo(client, auth_headers):
    resp = await client.get("/todos/999999", headers=auth_headers)
    assert resp.status_code == 404


async def test_update_todo(client, auth_headers):
    created = (
        await client.post("/todos", headers=auth_headers, json={"title": "Old title"})
    ).json()
    # Partial update: only toggle completion, title should be unchanged.
    resp = await client.patch(
        f"/todos/{created['id']}",
        headers=auth_headers,
        json={"is_completed": True},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["is_completed"] is True
    assert body["title"] == "Old title"


async def test_delete_todo(client, auth_headers):
    created = (
        await client.post("/todos", headers=auth_headers, json={"title": "Temp"})
    ).json()
    resp = await client.delete(f"/todos/{created['id']}", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["detail"] == "Todo deleted successfully"
    # It should be gone now.
    resp = await client.get(f"/todos/{created['id']}", headers=auth_headers)
    assert resp.status_code == 404
