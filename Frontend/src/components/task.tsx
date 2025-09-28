import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/taskApi";
import { motion, AnimatePresence } from "framer-motion";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  dueDate: string;
};

const TaskDashboard: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskData, setEditTaskData] = useState<Omit<Task, "_id"> | null>(
    null
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Omit<Task, "_id">>({
    title: "",
    description: "",
    status: "todo",
    dueDate: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
      },
    },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  };

  const handleSaveTask = async (taskId: string) => {
    if (!editTaskData) return;

    try {
      const res = await API.put(`/${taskId}`, { ...editTaskData, projectId });
      if (res.data.success) {
        setTasks(tasks.map((t) => (t._id === taskId ? res.data.data : t)));
        setEditingTaskId(null);
        setEditTaskData(null);
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // ✅ Fetch Tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const res = await API.get(`/`, { params: { projectId } });
        if (res.data.success) {
          setTasks(res.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [projectId]);

  // ✅ Create Task
  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim()) return;

    try {
      const res = await API.post(`/`, { ...newTask, projectId });
      if (res.data.success) {
        setTasks([...tasks, res.data.data]);
        setNewTask({ title: "", description: "", status: "todo", dueDate: "" });
      }
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  // ✅ Delete Task
  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await API.delete(`/${taskId}`);
      if (res.data.success) {
        setTasks(tasks.filter((t) => t._id !== taskId));
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return "bg-red-500";
      case "in-progress":
        return "bg-yellow-500";
      case "done":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return "To Do";
      case "in-progress":
        return "In Progress";
      case "done":
        return "Done";
      default:
        return status;
    }
  };

  return (
    <motion.div
      className="md:p-6 md:mx-auto py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold mb-6 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Task Management
      </motion.h1>

      {/* Create Task Form */}
      <motion.div
        className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg w-full md:mx-auto my-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ y: -2 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          ➕ Create New Task
        </h2>

        <div className="md:flex md:flex-wrap gap-4 items-start">
          {/* Title */}
          <motion.div
            className="flex-1 min-w-[200px]"
            whileFocus={{ scale: 1.02 }}
          >
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Title
            </label>
            <motion.input
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
              type="text"
              placeholder="Enter task title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          {/* Description */}
          <motion.div
            className="flex-1 min-w-[200px]"
            whileFocus={{ scale: 1.02 }}
          >
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <motion.textarea
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
              placeholder="Enter task description"
              rows={1}
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          {/* Status */}
          <motion.div className="w-48" whileFocus={{ scale: 1.02 }}>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Status
            </label>
            <motion.select
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
              value={newTask.status}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  status: e.target.value as Task["status"],
                })
              }
              whileFocus={{ scale: 1.02 }}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </motion.select>
          </motion.div>

          {/* Due Date */}
          <motion.div className="w-48" whileFocus={{ scale: 1.02 }}>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Due Date
            </label>
            <motion.input
              type="date"
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          {/* Add Button */}
          <motion.div
            className="w-48 flex items-end"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.button
              onClick={handleAddTask}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              Add Task
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Task List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-xl font-semibold mb-4 text-gray-700"
          variants={itemVariants}
        >
          Task List ({tasks.length})
        </motion.h2>

        <AnimatePresence>
          {tasks.length === 0 ? (
            <motion.p
              className="text-gray-500 text-center py-8"
              variants={itemVariants}
            >
              {isLoading
                ? "Loading tasks..."
                : "No tasks available. Create your first task!"}
            </motion.p>
          ) : (
            <motion.div
              className="overflow-x-auto"
              variants={containerVariants}
            >
              <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-purple-500 to-indigo-500">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-medium">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-white font-medium">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-white font-medium">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-white font-medium">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-white font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {tasks.map((task) => {
                      const isEditing = editingTaskId === task._id;
                      return (
                        <motion.tr
                          key={task._id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          whileHover={{
                            scale: 1.01,
                            backgroundColor: "rgba(139, 92, 246, 0.05)",
                          }}
                          className="border-b border-gray-200 transition-colors duration-200"
                        >
                          {/* Title */}
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <motion.input
                                className="w-full border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 p-1 font-semibold"
                                value={editTaskData?.title || ""}
                                onChange={(e) =>
                                  setEditTaskData({
                                    ...editTaskData!,
                                    title: e.target.value,
                                  })
                                }
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                              />
                            ) : (
                              <span className="font-semibold text-gray-800">
                                {task.title}
                              </span>
                            )}
                          </td>

                          {/* Description */}
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <motion.textarea
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                rows={2}
                                value={editTaskData?.description || ""}
                                onChange={(e) =>
                                  setEditTaskData({
                                    ...editTaskData!,
                                    description: e.target.value,
                                  })
                                }
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                              />
                            ) : (
                              <span className="text-gray-600">
                                {task.description}
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <motion.select
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                value={editTaskData?.status || "todo"}
                                onChange={(e) =>
                                  setEditTaskData({
                                    ...editTaskData!,
                                    status: e.target.value as Task["status"],
                                  })
                                }
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                              >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                              </motion.select>
                            ) : (
                              <motion.span
                                className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(
                                  task.status
                                )}`}
                                whileHover={{ scale: 1.1 }}
                              >
                                {getStatusText(task.status)}
                              </motion.span>
                            )}
                          </td>

                          {/* Due Date */}
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <motion.input
                                type="date"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                value={
                                  editTaskData?.dueDate?.split("T")[0] || ""
                                }
                                onChange={(e) =>
                                  setEditTaskData({
                                    ...editTaskData!,
                                    dueDate: e.target.value,
                                  })
                                }
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                              />
                            ) : (
                              <span className="text-gray-600">
                                {task.dueDate?.split("T")[0] || "No due date"}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-center space-x-2">
                            <motion.div className="flex gap-2 justify-center">
                              {isEditing ? (
                                <motion.button
                                  onClick={() => handleSaveTask(task._id)}
                                  className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Save
                                </motion.button>
                              ) : (
                                <motion.button
                                  onClick={() => {
                                    setEditingTaskId(task._id);
                                    setEditTaskData({
                                      title: task.title,
                                      description: task.description,
                                      status: task.status,
                                      dueDate: task.dueDate,
                                    });
                                  }}
                                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors duration-200"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Edit
                                </motion.button>
                              )}

                              <motion.button
                                onClick={() => handleDeleteTask(task._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Delete
                              </motion.button>
                            </motion.div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default TaskDashboard;
