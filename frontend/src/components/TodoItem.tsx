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

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400";

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

  return (
    <li className="flex items-start gap-3 rounded-md border border-gray-700 bg-gray-800 px-4 py-3">
      <input
        type="checkbox"
        checked={todo.is_completed}
        onChange={() => onToggle(todo)}
        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-gray-400"
      />

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
            className={inputClass}
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") cancel();
            }}
            placeholder="Description (optional)"
            className={inputClass}
          />
          <div className="flex gap-2">
            <button
              onClick={save}
              className="cursor-pointer rounded-md bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-600"
            >
              Save
            </button>
            <button
              onClick={cancel}
              className="cursor-pointer rounded-md px-3 py-1 text-sm text-gray-300 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <p
            className={todo.is_completed ? "text-gray-500 line-through" : "text-gray-100"}
          >
            {todo.title}
          </p>
          {todo.description && (
            <p
              className={`text-sm ${todo.is_completed ? "text-gray-600 line-through" : "text-gray-400"}`}
            >
              {todo.description}
            </p>
          )}
        </div>
      )}

      {!editing && (
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={startEditing}
            aria-label="Edit todo"
            title="Edit"
            className="cursor-pointer text-gray-400 hover:text-white"
          >
            <PencilIcon />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            aria-label="Delete todo"
            title="Delete"
            className="cursor-pointer text-red-400 hover:text-red-300"
          >
            <TrashIcon />
          </button>
        </div>
      )}
    </li>
  );
}
