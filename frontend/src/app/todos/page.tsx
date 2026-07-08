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

  const remaining = todos.filter((t) => !t.is_completed).length;

  if (loading || !user) {
    return <p className="text-ink/60 dark:text-cream/70">Loading…</p>;
  }

  return (
    <div>
      <div className="mb-6 flex items-baseline gap-3">
        <h1 className="inline-block -rotate-1 rounded-xl border-[3px] border-ink bg-white px-4 py-1.5 text-2xl font-semibold shadow-hard">
          My Todos
        </h1>
        <p className="text-base text-black dark:text-cream font-semibold translate-y-2">
        Act now, worry less <span className="mt-5 text-xl ">☕</span>
        </p>
      </div>

      <form onSubmit={handleAdd} className="mb-6 space-y-2">
        <div className="flex">
          <input
            type="text"
            placeholder="What needs doing?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-pop flex-1 rounded-r-none border-r-0"
          />
          <button
            type="submit"
            aria-label="Add todo"
            title="Add todo"
            className="btn-pop shrink-0 gap-1 rounded-l-none bg-grape-soft px-5"
          >
            <PlusIcon className="h-4 w-4" />
            Add!
          </button>
        </div>
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-pop"
        />
      </form>

      {error && (
        <p className="card-pop mb-4 rounded-xl border-l-8 border-l-berry px-4 py-2 text-sm">
          {error}
        </p>
      )}

      {loadingTodos ? (
        <p className="text-ink/60 dark:text-cream/70">Loading todos…</p>
      ) : todos.length === 0 ? (
        <p className="card-pop rounded-2xl px-5 py-6 text-center text-ink/70">
          Nothing yet — add your first one! ✨
        </p>
      ) : (
        <>
          <ul className="space-y-4">
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
          <p className="mt-10  text-center text-sm dark:text-cream">
            <span className="rounded-full border-2 border-ink bg-sun px-4 py-1 font-semibold text-ink shadow-hard-sm">
              {remaining} left
            </span>{" "}
            —{" "}
            <span className="text-base font-semibold text-black dark:text-cream">
              you got this!
            </span>
          </p>
        </>
      )}
    </div>
  );
}
