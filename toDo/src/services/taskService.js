const STORAGE_KEY = "tasks";

export const taskService = {
  getTasks: async () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveTasks: async (tasks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },
};
