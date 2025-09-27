import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import API from "../api/taskApi";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  dueDate: string;
};

// ✅ Popup Component for Editing
type PopupProps = {
  task: Task;
  setTask: (task: Task | null) => void;
  saveTask: (task: Task) => void;
};

const EditPopup: React.FC<PopupProps> = ({ task, setTask, saveTask }) => {
  const [formData, setFormData] = useState<Task>(task);

  useEffect(() => {
    setFormData(task);
  }, [task]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Edit Task</h2>

        {/* Title */}
        <label className="block mb-3">
          <span className="block text-sm font-semibold text-gray-700 mb-1">
            Title
          </span>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </label>

        {/* Description */}
        <label className="block mb-3">
          <span className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </span>
          <textarea
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows={2}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </label>

        {/* Status */}
        <label className="block mb-3">
          <span className="block text-sm font-semibold text-gray-700 mb-1">
            Status
          </span>
          <select
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as Task["status"],
              })
            }
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        {/* Due Date */}
        <label className="block mb-5">
          <span className="block text-sm font-semibold text-gray-700 mb-1">
            Due Date
          </span>
          <input
            type="date"
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            value={formData.dueDate.split("T")[0] || ""}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />
        </label>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setTask(null)}
            className="px-4 py-2 rounded-lg bg-gray-500 text-gray-700 font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => saveTask(formData)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            ✅ Save
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskDashboard: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const location = useLocation();
  const projectName = location.state?.projectName || projectId;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Omit<Task, "_id">>({
    title: "",
    description: "",
    status: "todo",
    dueDate: "",
  });

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch Tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get("/", { params: { projectId } });
        if (res.data.success) setTasks(res.data.data || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, [projectId]);

  // Add Task
  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim()) return;
    try {
      const res = await API.post("/", { ...newTask, projectId });
      if (res.data.success) {
        setTasks([...tasks, res.data.data]);
        setNewTask({ title: "", description: "", status: "todo", dueDate: "" });
      }
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await API.delete(`/${taskId}`);
      if (res.data.success) setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Save Edited Task
  const handleSaveEdit = async (task: Task) => {
    try {
      const res = await API.put(`/${task._id}`, { ...task, projectId });
      if (res.data.success) {
        setTasks(tasks.map((t) => (t._id === task._id ? res.data.data : t)));
        setEditingTask(null);
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const getStatusClasses = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return "bg-red-500";
      case "in-progress":
        return "bg-yellow-500";
      case "done":
        return "bg-green-600";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="md:max-w-7xl md:mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-indigo-800 border-b pb-2">
          📋 Tasks for Project:{" "}
          <span className="text-indigo-600 font-semibold">{projectName}</span>
        </h1>

        {/* Create Task Form */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full my-8 border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-indigo-700">
            ➕ Create New Task
          </h2>
          <div className="flex flex-col md:flex-row md:flex-wrap gap-6 items-end">
            {/* Title */}
            <div className="flex-1 w-full md:min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <div className="flex-1 w-full md:min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={1}
                className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none resize-none transition duration-150"
                placeholder="Enter task description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </div>

            {/* Status */}
            <div className="w-full md:w-48">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none bg-white transition duration-150"
                value={newTask.status}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    status: e.target.value as Task["status"],
                  })
                }
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="w-full md:w-48">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none bg-white transition duration-150"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
              />
            </div>

            {/* Add Button */}
            <div className="w-full md:w-48">
              <button
                onClick={handleAddTask}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition duration-300 shadow-lg transform hover:scale-[1.02] active:scale-100"
              >
                ➕ Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Project Task List
          </h2>
          {tasks.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-4">
              <p className="text-gray-500 text-center italic">
                No tasks available. Create a new task above!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto shadow-2xl rounded-xl border border-gray-100 mt-4">
              <table className="min-w-full bg-white text-sm md:text-base">
                <thead className="bg-indigo-100 border-b border-indigo-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-indigo-700">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-indigo-700 hidden sm:table-cell">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-indigo-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-indigo-700">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-indigo-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr
                      key={task._id}
                      className="border-b border-gray-200 hover:bg-indigo-50 transition duration-150"
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {task.title}
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                        {task.description}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-xs font-semibold uppercase shadow-sm ${getStatusClasses(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {task.dueDate.split("T")[0] || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-center space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="bg-indigo-500 text-white px-3 py-1 rounded-lg hover:bg-indigo-600 text-sm font-medium transition duration-200 shadow-md"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm font-medium transition duration-200 shadow-md"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Popup Modal */}
        {editingTask && (
          <EditPopup
            task={editingTask}
            setTask={setEditingTask}
            saveTask={handleSaveEdit}
          />
        )}
      </div>
    </div>
  );
};

export default TaskDashboard;
