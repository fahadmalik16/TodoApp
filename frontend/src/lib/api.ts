import { tokenStorage } from "./auth";
import { Todo, Token, User } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8090";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let detail: string = res.statusText;
    try {
      const body = await res.json();
      detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    } catch {
      // response had no JSON body
    }
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  // Auth
  signup: (data: { username: string; email: string; password: string }) =>
    request<User>("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  signin: (data: { email: string; password: string }) =>
    request<Token>("/auth/signin", { method: "POST", body: JSON.stringify(data) }),
  me: () => request<User>("/auth/me"),

  // Todos
  listTodos: () => request<Todo[]>("/todos"),
  createTodo: (data: { title: string; description?: string | null }) =>
    request<Todo>("/todos", { method: "POST", body: JSON.stringify(data) }),
  updateTodo: (
    id: number,
    data: Partial<{ title: string; description: string | null; is_completed: boolean }>,
  ) => request<Todo>(`/todos/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteTodo: (id: number) =>
    request<{ detail: string }>(`/todos/${id}`, { method: "DELETE" }),
};
