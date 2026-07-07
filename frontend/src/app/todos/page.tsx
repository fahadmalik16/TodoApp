"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import { Todo } from "@/lib/types";
import TodoItem from "@/components/TodoItem";
import { PlusIcon } from "@/components/icons";

export default function TodosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loadingTodos, setLoadingTodos] = useState(true);

  // Redirect to sign-in if not authenticated.
  useEffect(() => {
    if (!loading && !user) router.replace("/signin");
  }, [loading, user, router]);

  // Load todos once we know who the user is.
  useEffect(() => {
    if (!user) return;
    api
      .listTodos()
      .then(setTodos)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Failed to load todos"))
      .finally(() => setLoadingTodos(false));
  }, [user]);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setError("");
    try {
      const todo = await api.createTodo({
        title: title.trim(),
        description: description.trim() || null,
      });
      setTodos([todo, ...todos]);
      setTitle("");
      setDescription("");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to add todo");
    }
  }

  async function handleToggle(todo: Todo) {
    const updated = await api.updateTodo(todo.id, { is_completed: !todo.is_completed });
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
  }

  async function handleDelete(id: number) {
    await api.deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleEdit(
    id: number,
    data: { title?: string; description?: string | null },
  ) {
    const updated = await api.updateTodo(id, data);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  if (loading || !user) {
    return <p className="text-gray-400">Loading…</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-white">My Todos</h1>

      <form onSubmit={handleAdd} className="mb-6 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="What needs doing?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <button
            type="submit"
            aria-label="Add todo"
            title="Add todo"
            className="flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-800 p-2.5 text-white hover:bg-gray-700"
          >
            <PlusIcon />
          </button>
        </div>
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
      </form>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {loadingTodos ? (
        <p className="text-gray-400">Loading todos…</p>
      ) : todos.length === 0 ? (
        <p className="text-gray-400">No todos yet. Add one above.</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
