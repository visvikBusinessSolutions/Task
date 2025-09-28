import React, { useEffect, useState } from "react";
import API from "../api/projectApi";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  type Variants,
  type Transition,
} from "framer-motion";

type Project = {
  _id: string;
  title: string;
  description: string;
  status: "active" | "completed";
};

const ProjectDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Omit<Project, "_id"> | null>(
    null
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Omit<Project, "_id">>({
    title: "",
    description: "",
    status: "active",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const springTransition: Transition = { type: "spring", damping: 15 };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: springTransition,
    },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const res = await API.get("/");
        if (res.data.success) {
          setProjects(res.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleSaveProject = async (id: string) => {
    if (!editFormData) return;

    try {
      const res = await API.put(`/${id}`, editFormData);
      if (res.data.success) {
        setProjects(
          projects.map((proj) => (proj._id === id ? res.data.data : proj))
        );
        setEditingProjectId(null);
        setEditFormData(null);
      }
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title.trim() || !newProject.description.trim()) return;

    try {
      const res = await API.post("/", newProject);
      if (res.data.success) {
        setProjects([...projects, res.data.data]);
        setNewProject({ title: "", description: "", status: "active" });
      }
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await API.delete(`/${id}`);
      if (res.data.success) {
        setProjects(projects.filter((proj) => proj._id !== id));
      }
    } catch (err) {
      console.error("Error deleting project:", err);
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
        Project Dashboard
      </motion.h1>

      {/* Create Project Form */}
      <motion.div
        className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg w-full md:mx-auto my-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ y: -2 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          ➕ Create New Project
        </h2>

        <div className="md:flex md:flex-wrap gap-4 items-start ">
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
              placeholder="Enter project title"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
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
              placeholder="Enter project description"
              rows={1}
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
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
              value={newProject.status}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  status: e.target.value as Project["status"],
                })
              }
              whileFocus={{ scale: 1.02 }}
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </motion.select>
          </motion.div>

          {/* Add Button */}

          <div className="flex h-18 items-end ">
            <motion.div
              className="w-48"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.button
                onClick={handleAddProject}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Add Project
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Project List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-xl font-semibold mb-4 text-gray-700"
          variants={itemVariants}
        >
          Your Projects ({projects.length})
        </motion.h2>

        <AnimatePresence>
          {projects.length === 0 ? (
            <motion.p
              className="text-gray-500 text-center py-8"
              variants={itemVariants}
            >
              {isLoading
                ? "Loading projects..."
                : "No projects available. Create your first project!"}
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
                    <th className="px-6 py-4 text-white font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {projects.map((proj) => {
                      const isEditing = editingProjectId === proj._id;
                      return (
                        <motion.tr
                          key={proj._id}
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
                          {/* Rest of your table row content remains the same */}
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <motion.input
                                className="w-full border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 p-1 text-lg font-semibold"
                                value={editFormData?.title || ""}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData!,
                                    title: e.target.value,
                                  })
                                }
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                              />
                            ) : (
                              <span className="font-semibold text-gray-800">
                                {proj.title}
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            {isEditing ? (
                              <motion.textarea
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                rows={2}
                                value={editFormData?.description || ""}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData!,
                                    description: e.target.value,
                                  })
                                }
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                              />
                            ) : (
                              <span className="text-gray-600">
                                {proj.description}
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            {isEditing ? (
                              <motion.select
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                value={editFormData?.status || "active"}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData!,
                                    status: e.target.value as Project["status"],
                                  })
                                }
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                              >
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                              </motion.select>
                            ) : (
                              <motion.span
                                className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                                  proj.status === "active"
                                    ? "bg-green-500"
                                    : "bg-blue-500"
                                }`}
                                whileHover={{ scale: 1.1 }}
                              >
                                {proj.status}
                              </motion.span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-center space-x-2">
                            <motion.div className="flex gap-2 justify-center">
                              {isEditing ? (
                                <motion.button
                                  onClick={() => handleSaveProject(proj._id)}
                                  className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Save
                                </motion.button>
                              ) : (
                                <motion.button
                                  onClick={() => {
                                    setEditingProjectId(proj._id);
                                    setEditFormData({
                                      title: proj.title,
                                      description: proj.description,
                                      status: proj.status,
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
                                onClick={() => handleDeleteProject(proj._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Delete
                              </motion.button>

                              <motion.button
                                onClick={() =>
                                  navigate(`/projects/${proj._id}/tasks`)
                                }
                                className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Tasks
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

export default ProjectDashboard;
