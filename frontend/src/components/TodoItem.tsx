"use client";

import { useState } from "react";

import { Todo } from "@/lib/types";
import { PencilIcon, TrashIcon } from "@/components/icons";

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onEdit: (
    id: number,
    data: { title?: string; description?: string | null },
  ) => Promise<void>;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? "");

  function startEditing() {
    setTitle(todo.title);
    setDescription(todo.description ?? "");
    setEditing(true);
  }

  function cancel() {
    setEditing(false);
  }

  async function save() {
    const trimmedTitle = title.trim();
    // Title is required — ignore an empty edit.
    const finalTitle = trimmedTitle || todo.title;
    const finalDescription = description.trim() || null;

    const changes: { title?: string; description?: string | null } = {};
    if (finalTitle !== todo.title) changes.title = finalTitle;
    if (finalDescription !== (todo.description ?? null)) {
      changes.description = finalDescription;
    }

    if (Object.keys(changes).length > 0) {
      await onEdit(todo.id, changes);
    }
    setEditing(false);
  }

  const doneText = "text-ink/50 [text-decoration:line-through_wavy_var(--color-berry)_2px]";

  return (
    <li
      className={`animate-pop-in flex items-start gap-3 rounded-2xl border-[3px] border-ink px-4 py-3 transition-[translate,box-shadow,rotate] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:-rotate-[0.5deg] hover:shadow-hard-xl ${
        todo.is_completed ? "bg-done shadow-hard-sm" : "bg-white shadow-hard-lg"
      }`}
    >
      <span className="relative mt-0.5 flex shrink-0">
        <input
          type="checkbox"
          checked={todo.is_completed}
          onChange={() => onToggle(todo)}
          aria-label={`Mark "${todo.title}" as ${todo.is_completed ? "not done" : "done"}`}
          className="peer h-6 w-6 cursor-pointer appearance-none rounded-full border-[3px] border-ink bg-white transition-[scale,background-color] duration-150 checked:bg-mint active:scale-75"
        />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 m-auto h-3.5 w-3.5 opacity-0 transition-opacity peer-checked:opacity-100"
        >
          <path d="M4 12l5 5L20 6" />
        </svg>
      </span>

      {editing ? (
        <div className="flex-1 space-y-2">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") cancel();
            }}
            placeholder="Title"
            className="input-pop px-3 py-1.5"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") cancel();
            }}
            placeholder="Description (optional)"
            className="input-pop px-3 py-1.5"
          />
          <div className="flex items-center gap-3">
            <button onClick={save} className="btn-pop bg-mint px-4 py-1 text-sm">
              Save
            </button>
            <button
              onClick={cancel}
              className="cursor-pointer text-sm text-ink/70 underline hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <p className={todo.is_completed ? doneText : "font-medium"}>{todo.title}</p>
          {todo.description && (
            <p className={`text-sm ${todo.is_completed ? doneText : "text-ink/60"}`}>
              {todo.description}
            </p>
          )}
        </div>
      )}

      {!editing && (
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={startEditing}
            aria-label="Edit todo"
            title="Edit"
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border-2 border-ink bg-butter transition-[scale] duration-150 hover:scale-110 active:scale-90"
          >
            <PencilIcon />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            aria-label="Delete todo"
            title="Delete"
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border-2 border-ink bg-pink transition-[scale] duration-150 hover:scale-110 active:scale-90"
          >
            <TrashIcon />
          </button>
        </div>
      )}
    </li>
  );
}
