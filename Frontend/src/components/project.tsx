import React, { useEffect, useState } from "react";
import API from "../api/projectApi";
import { useNavigate } from "react-router-dom";

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

  // ✅ Fetch all projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/");
        if (res.data.success) {
          setProjects(res.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
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
        setEditingProjectId(null); // exit edit mode
        setEditFormData(null);
      }
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  // ✅ Create Project
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

  // ✅ Delete Project
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
    <div className="md:p-6 md:mx-auto py-2">
      <h1 className="text-2xl font-bold mb-4">Project Dashboard</h1>

      {/* Create Project Form */}
      <div className="bg-white border-gray p-6 rounded-2xl shadow-sm w-full md:mx-auto my-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          ➕ Create Project
        </h2>

        <div className="md:flex md:flex-wrap gap-4 items-start">
          {/* Title */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Title
            </label>
            <input
              className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              type="text"
              placeholder="Enter project title"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter project description"
              rows={1}
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
            />
          </div>

          {/* Status */}
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Status
            </label>
            <select
              className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={newProject.status}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  status: e.target.value as Project["status"],
                })
              }
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Add Button */}
          <div className="w-48">
            <button
              onClick={handleAddProject}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
            >
              Add Project
            </button>
          </div>
        </div>
      </div>

      {/* Project List */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Project Lists</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500">No projects available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-gray-600 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => {
                  const isEditing = editingProjectId === proj._id;
                  return (
                    <tr
                      key={proj._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                    >
                      {/* Title */}
                      <td className="px-4 py-2">
                        {isEditing ? (
                          <input
                            className="w-full border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 p-1 text-lg font-semibold"
                            value={editFormData?.title || ""}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData!,
                                title: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <span className="font-semibold">{proj.title}</span>
                        )}
                      </td>

                      {/* Description */}
                      <td className="px-4 py-2">
                        {isEditing ? (
                          <textarea
                            className="w-full border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            rows={1}
                            value={editFormData?.description || ""}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData!,
                                description: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <span>{proj.description}</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-2">
                        {isEditing ? (
                          <select
                            className="w-full border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            value={editFormData?.status || "active"}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData!,
                                status: e.target.value as Project["status"],
                              })
                            }
                          >
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                          </select>
                        ) : (
                          <span
                            className={`px-2 py-1 rounded text-white ${
                              proj.status === "active"
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }`}
                          >
                            {proj.status}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-2 text-center space-x-2">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveProject(proj._id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingProjectId(proj._id);
                              setEditFormData({
                                title: proj.title,
                                description: proj.description,
                                status: proj.status,
                              });
                            }}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                          >
                            Edit
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteProject(proj._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/projects/${proj._id}/tasks`)
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors duration-200"
                        >
                          Tasks
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDashboard;
