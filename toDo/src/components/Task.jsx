import { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";

export default function Task({ task, onDelete, onToggle }) {
  const formatDateTime = (iso) => {
    if (!iso) return null;

    const d = new Date(iso);

    return d.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="group flex items-center justify-between bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-lg hover:border-neutral-600 hover:scale-105 hover:shadow-lg hover:shadow-blue-500 transition-all duration-300">
      <div>
        <div className={task.completed ? "line-through text-neutral-500" : ""}>
          {task.text}
        </div>

        {task.dueDateTime && (
          <div className="text-xs text-neutral-400 mt-1">
            {formatDateTime(task.dueDateTime)}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="w-5 h-5 accent-white cursor-pointer"
        />

        {/* <span
          className={`text-sm transition ${
            task.completed ? "line-through text-neutral-500" : ""
          }`}
        >
          {task.text}
        </span> */}
      </div>

      <span
        className={`text-xs text-neutral-400 ${
          task.dueDate ? "block" : "hidden"
        }`}
      >
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ""}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-red-400 text-sm transition cursor-pointer"
      >
        <FaTrashCan />
      </button>
    </div>
  );
}
