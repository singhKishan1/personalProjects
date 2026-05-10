import { useState } from "react";
import { toast } from "react-toastify";

function TaskInput({ onAdd }) {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!text.trim()) {
      setError("Task cannot be empty");
      toast.error("Task cannot be empty");
      return;
    }

    let dueDateTime = null;
    if (dueDate) {
      dueDateTime = dueTime
        ? new Date(`${dueDate}T${dueTime}`)
        : new Date(`${dueDate}T00:00`);
    }

    onAdd(text, dueDateTime);
    setText("");
    setDueDate("");
    setDueTime("");
    setError("");
  };

  return (
    <>
      <div className="flex items-center bg-neutral-900/70 backdrop-blur border border-neutral-700 rounded-lg overflow-hidden">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError("");
          }}
          placeholder="Add a task..."
          className="w-full bg-neutral-900/70 backdrop-blur border border-neutral-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-white/20 transition"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />

        {/* Due Date Picker */}
        <div className="relative">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer hover:opacity-10 transition hover:text-red-500"
          />

          <div className="px-3 py-2 bg-neutral-800 rounded-md text-sm text-neutral-300">
            {dueDate ? dueDate : "Pick date"}
          </div>
        </div>

        {/* Time */}
        <input
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          className="bg-neutral-800 text-sm px-2 py-2 rounded-md"
        />

        {/* Add Button */}
        <button
          onClick={handleAdd}
          className="px-5 py-3 bg-white text-black text-sm font-medium hover:bg-neutral-200 transition"
        >
          Add
        </button>
      </div>
      <div className="text-red-400 text-sm mt-1">{error}</div>
    </>
  );
}

export default TaskInput;
