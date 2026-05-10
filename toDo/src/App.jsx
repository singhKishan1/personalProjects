import Task from "./components/Task";
import TaskInput from "./components/TaskInput";
import { taskService } from "./services/taskService";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const normalize = (text) => text.trim().toLowerCase();

  // load task on start
  useEffect(() => {
    const loadTasks = async () => {
      const storedTasks = await taskService.getTasks();
      setTasks(storedTasks);
    };
    loadTasks();
  }, []);

  // persist whenever tasks change
  useEffect(() => {
    taskService.saveTasks(tasks);
    console.log("Tasks saved:", tasks);
  }, [tasks]);

  const addTask = (text, dueDateTime) => {
    const normalizedText = normalize(text);

    const isDuplicate = tasks.some(
      (task) => normalize(task.text) === normalizedText,
    );

    if (isDuplicate) {
      toast.error("Task already exists");
      return;
    }

    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDateTime: dueDateTime
      ? dueDateTime.toISOString()
      : null,
    };
    
    toast.success("Task added");
    setTasks((prev) => [...prev, newTask]);
  };

  // remove task by id
  const deleteTask = (id) => {
    toast.success("Task deleted");
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // toggle task completion
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  // helper to check if a date is today
  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // filter tasks based on current filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "today") return isToday(task.createdAt);
    if (filter === "upcoming")
      return task.dueDate && new Date(task.dueDate) > new Date();
    if (filter === "completed") return task.completed;
    return true; // all
  });

  return (
    <div className="h-screen bg-neutral-950 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-neutral-900 p-5 border-r border-neutral-800">
        <h1 className="text-xl font-semibold mb-6">TaskFlow</h1>

        <div className="space-y-3 text-sm">
          <div
            onClick={() => setFilter("today")}
            className={`cursor-pointer px-2 py-1 rounded transition-all duration-300 ${
              filter === "today"
                ? "bg-white text-black"
                : "text-neutral-400 hover:text-white cursor-pointer"
            }`}
          >
            Today
          </div>
          <div
            onClick={() => setFilter("upcoming")}
            className={`cursor-pointer px-2 py-1 rounded transition-all duration-300  ${
              filter === "upcoming"
                ? "bg-white text-black"
                : "text-neutral-400 hover:text-white cursor-pointer"
            }`}
          >
            Upcoming
          </div>
          <div
            onClick={() => setFilter("completed")}
            className={`cursor-pointer px-2 py-1 rounded transition-all duration-300  ${
              filter === "completed"
                ? "bg-white text-black"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Completed
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-8 bg-gradient-to-br from-neutral-950 to-neutral-900">
        <h2 className="text-2xl font-semibold mb-6">
          {filter === "today"
            ? "Today"
            : filter === "upcoming"
              ? "Upcoming"
              : filter === "completed"
                ? "Completed"
                : "All Tasks"}
        </h2>

        {/* Input */}
        <div className="mb-6">
          <TaskInput onAdd={addTask} />
        </div>

        {/* Task List */}
        <div className="mt-6 space-y-4">
          {filteredTasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              onDelete={deleteTask}
              onToggle={toggleTask}
            />
          ))}
        </div>
      </div>
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar theme="dark"/>
    </div>
  );
}
