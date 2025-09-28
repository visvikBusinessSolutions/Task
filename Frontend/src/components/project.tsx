// import React, { useEffect, useState } from "react";
// import API from "../api/projectApi";
// import { useNavigate } from "react-router-dom";
// import Popup from "./pop";

// type Project = {
//   _id: string;
//   title: string;
//   description: string;
//   status: "active" | "completed";
// };

// const ProjectDashboard: React.FC = () => {
//   const navigate = useNavigate();
//   const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
//   const [editFormData, setEditFormData] = useState<Omit<Project, "_id"> | null>(
//     null
//   );
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [newProject, setNewProject] = useState<Omit<Project, "_id">>({
//     title: "",
//     description: "",
//     status: "active",
//   });

//   // ✅ Fetch all projects on mount
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const res = await API.get("/");
//         if (res.data.success) {
//           setProjects(res.data.data || []);
//         }
//       } catch (err) {
//         console.error("Error fetching projects:", err);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const handleSaveProject = async (id: string) => {
//     if (!editFormData) return;

//     try {
//       const res = await API.put(`/${id}`, editFormData);
//       if (res.data.success) {
//         setProjects(
//           projects.map((proj) => (proj._id === id ? res.data.data : proj))
//         );
//         setEditingProjectId(null); // exit edit mode
//         setEditFormData(null);
//       }
//     } catch (err) {
//       console.error("Error updating project:", err);
//     }
//   };

//   // ✅ Create Project
//   const handleAddProject = async () => {
//     if (!newProject.title.trim() || !newProject.description.trim()) return;

//     try {
//       const res = await API.post("/", newProject);
//       if (res.data.success) {
//         setProjects([...projects, res.data.data]);
//         setNewProject({ title: "", description: "", status: "active" });
//       }
//     } catch (err) {
//       console.error("Error creating project:", err);
//     }
//   };

//   // ✅ Delete Project
//   const handleDeleteProject = async (id: string) => {
//     try {
//       const res = await API.delete(`/${id}`);
//       if (res.data.success) {
//         setProjects(projects.filter((proj) => proj._id !== id));
//       }
//     } catch (err) {
//       console.error("Error deleting project:", err);
//     }
//   };

//   return (
//     <div className="md:p-6 md:mx-auto py-2">
//       <h1 className="text-2xl font-bold mb-4">Project Dashboard</h1>

//       {/* Create Project Form */}
//       <div className="bg-white border-gray p-6 rounded-2xl shadow-sm w-full md:mx-auto my-6">
//         <h2 className="text-2xl font-bold mb-6 text-gray-800">
//           ➕ Create Project
//         </h2>

//         <div className="md:flex md:flex-wrap gap-4 items-start">
//           {/* Title */}
//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-sm font-medium text-gray-600 mb-1">
//               Title
//             </label>
//             <input
//               className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//               type="text"
//               placeholder="Enter project title"
//               value={newProject.title}
//               onChange={(e) =>
//                 setNewProject({ ...newProject, title: e.target.value })
//               }
//             />
//           </div>

//           {/* Description */}
//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-sm font-medium text-gray-600 mb-1">
//               Description
//             </label>
//             <textarea
//               className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//               placeholder="Enter project description"
//               rows={1}
//               value={newProject.description}
//               onChange={(e) =>
//                 setNewProject({ ...newProject, description: e.target.value })
//               }
//             />
//           </div>

//           {/* Status */}
//           <div className="w-48">
//             <label className="block text-sm font-medium text-gray-600 mb-1">
//               Status
//             </label>
//             <select
//               className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//               value={newProject.status}
//               onChange={(e) =>
//                 setNewProject({
//                   ...newProject,
//                   status: e.target.value as Project["status"],
//                 })
//               }
//             >
//               <option value="active">Active</option>
//               <option value="completed">Completed</option>
//             </select>
//           </div>

//           {/* Add Button */}
//           <div className="w-48">
//             <button
//               onClick={handleAddProject}
//               className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
//             >
//               Add Project
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Project List */}
//       <div>
//           <h2 className="text-lg font-semibold mb-2">Project Lists</h2>
//           {projects.length === 0 ? (
//             <p className="text-gray-500">No projects available.</p>
//           ) : (
//             <div className="p-6 overflow-x-auto">
//               <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-4 py-2 text-left">Title</th>
//                     <th className="px-4 py-2 text-left">Description</th>
//                     <th className="px-4 py-2 text-left">Status</th>
//                     <th className="px-4 py-2">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {projects.map((proj) => (
//                     <tr key={proj._id} className="border-b hover:bg-gray-50">
//                       <td className="px-4 py-2">{proj.title}</td>
//                       <td className="px-4 py-2">{proj.description}</td>
//                       <td className="px-4 py-2">
//                         <span
//                           className={`px-2 py-1 rounded text-white ${
//                             proj.status === "active" ? "bg-blue-500" : "bg-green-500"
//                           }`}
//                         >
//                           {proj.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-2 space-x-2 text-center">
//                         <button
//                           onClick={() => handleEditClick(proj)}
//                           className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteProject(proj._id)}
//                           className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {/* ✨ Modal for Editing */}
//               {editingProject && (
//                 <Popup
//                   editingProject={editingProject}
//                   setEditingProject={setEditingProject}
//                   handleSaveEdit={handleSaveEdit}
//                 />
//               )}
//             </div>
//           )}
//       </div>
//     </div>

//   );
// };

// export default ProjectDashboard;
import React, { useEffect, useState } from "react";
import API from "../api/projectApi";

import Popup from "./pop";

import { useNavigate } from "react-router-dom";

type Project = {
  _id: string;
  title: string;
  description: string;
  status: "active" | "completed";
};

const ProjectDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Omit<Project, "_id">>({
    title: "",
    description: "",
    status: "active",
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // ✅ Fetch all projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/api/v1/project");
        if (res.data.success) {
          setProjects(res.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  // ✅ Create Project
  const handleAddProject = async () => {
    if (!newProject.title.trim() || !newProject.description.trim()) return;

    try {
      const res = await API.post("/api/v1/project", newProject);
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
      const res = await API.delete(`/api/v1/project/${id}`);
      if (res.data.success) {
        setProjects(projects.filter((proj) => proj._id !== id));
      }
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  // ✅ Edit
  const handleEditClick = (project: Project) => {
    setEditingProject(project);
  };

  // ✅ Save Edit
  const handleSaveEdit = async () => {
    if (!editingProject) return;

    try {
      const res = await API.put(
        `/api/v1/project/${editingProject._id}`,
        editingProject
      );
      if (res.data.success) {
        setProjects(
          projects.map((proj) =>
            proj._id === editingProject._id ? res.data.data : proj
          )
        );
        setEditingProject(null);
      }
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  return (
    // <div className="md:p-6">
    //   <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
    //     Project Dashboard
    //   </h1>

    //   {/* Create Project Form */}
    //   <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm w-full my-6">
    //     <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-center md:text-left">
    //       ➕ Create Project
    //     </h2>

    //     <div className="flex flex-col md:flex-row md:flex-wrap gap-4 items-start">
    //       {/* Title */}
    //       <div className="flex-1 w-full md:min-w-[200px]">
    //         <label className="block text-sm font-medium text-gray-600 mb-1">
    //           Title
    //         </label>
    //         <input
    //           className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
    //           type="text"
    //           placeholder="Enter project title"
    //           value={newProject.title}
    //           onChange={(e) =>
    //             setNewProject({ ...newProject, title: e.target.value })
    //           }
    //         />
    //       </div>

    //       {/* Description */}
    //       <div className="flex-1 w-full md:min-w-[200px]">
    //         <label className="block text-sm font-medium text-gray-600 mb-1">
    //           Description
    //         </label>
    //         <textarea
    //           className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
    //           placeholder="Enter project description"
    //           rows={1}
    //           value={newProject.description}
    //           onChange={(e) =>
    //             setNewProject({ ...newProject, description: e.target.value })
    //           }
    //         />
    //       </div>

    //       {/* Status */}
    //       <div className="w-full md:w-48">
    //         <label className="block text-sm font-medium text-gray-600 mb-1">
    //           Status
    //         </label>
    //         <select
    //           className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none "
    //           value={newProject.status}
    //           onChange={(e) =>
    //             setNewProject({
    //               ...newProject,
    //               status: e.target.value as Project["status"],
    //             })
    //           }
    //         >
    //           <option value="active">Active</option>
    //           <option value="completed">Completed</option>
    //         </select>
    //       </div>

    //       {/* Add Button */}
    //       <div className="w-full md:w-48 md:mt-6">
    //         <button
    //           onClick={handleAddProject}
    //           className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
    //         >
    //           Add Project
    //         </button>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Project List */}
    //   <div>
    //     <h2 className="text-lg font-semibold mb-2 text-center md:text-left">
    //       Project Lists
    //     </h2>
    //     {projects.length === 0 ? (
    //       <p className="text-gray-500 text-center">No projects available.</p>
    //     ) : (
    //       <div className="p-2 md:p-6 overflow-x-auto">
    //         <table className="min-w-full bg-white shadow rounded-lg overflow-hidden text-sm md:text-base">
    //           <thead className="bg-gray-100">
    //             <tr>
    //               <th className="px-2 md:px-4 py-2 text-left">Title</th>
    //               <th className="px-2 md:px-4 py-2 text-left">Description</th>
    //               <th className="px-2 md:px-4 py-2 text-left">Status</th>
    //               <th className="px-2 md:px-4 py-2 text-center">Actions</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {projects.map((proj) => (
    //               <tr
    //                 key={proj._id}
    //                 className="border-b border-gray-300 hover:bg-gray-50 transition"
    //               >
    //                 <td className="px-2 md:px-4 py-2">{proj.title}</td>
    //                 <td className="px-2 md:px-4 py-2">{proj.description}</td>
    //                 <td className="px-2 md:px-4 py-2">
    //                   <span
    //                     className={`px-2 py-1 rounded text-white text-xs md:text-sm ${
    //                       proj.status === "active"
    //                         ? "bg-blue-500"
    //                         : "bg-green-500"
    //                     }`}
    //                   >
    //                     {proj.status}
    //                   </span>
    //                 </td>
    //                 <td className="px-2 md:px-4 py-2 space-x-1 md:space-x-2 text-center">
    //                   <button
    //                     onClick={() => handleEditClick(proj)}
    //                     className="bg-yellow-500 text-white md:px-3 rounded hover:bg-yellow-600 text-xs md:text-sm"
    //                   >
    //                     Edit
    //                   </button>
    //                   <button
    //                     onClick={() => navigate(`/projects/${proj._id}/tasks`)}
    //                     className="bg-green-500 text-white md:px-3 rounded hover:bg-green-600 text-xs md:text-sm"
    //                   >
    //                     Create task
    //                   </button>
    //                   <button
    //                     onClick={() => handleDeleteProject(proj._id)}
    //                     className="bg-red-500 text-white md:px-3 rounded hover:bg-red-600 text-xs md:text-sm"
    //                   >
    //                     Delete
    //                   </button>
    //                 </td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>

    //         {/* ✨ Modal for Editing */}
    //         {editingProject && (
    //           <Popup
    //             editingProject={editingProject}
    //             setEditingProject={setEditingProject}
    //             handleSaveEdit={handleSaveEdit}
    //           />
    //         )}
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div className="md:p-6 p-4">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-800 text-center md:text-left">
        Project Management Dashboard
      </h1>

      {/* Create Project Form - Now a professional 'Card' */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full my-8 border border-gray-100">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-indigo-700 text-center md:text-left flex items-center">
          <span className="text-2xl">+ </span>
          Create New Project
        </h2>

        <div className="flex flex-col md:flex-row md:flex-wrap gap-6 items-end">
          {/* Title */}
          <div className="flex-1 w-full md:min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150"
              type="text"
              placeholder="Enter project title"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div className="flex-1 w-full md:min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none resize-none transition duration-150"
              placeholder="Enter project description"
              rows={1}
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
            />
          </div>

          {/* Status */}
          <div className="w-full md:w-48">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none bg-white transition duration-150 appearance-none pr-8"
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
          <div className="w-full md:w-48">
            <button
              onClick={handleAddProject}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition duration-300 shadow-md transform hover:scale-[1.02] active:scale-100"
            >
              Add Project
            </button>
          </div>
        </div>
      </div>

      {/* Project List */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center md:text-left">
          Current Projects
        </h2>
        {projects.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-4">
            <p className="text-gray-500 text-center italic">
              No projects available. Click "Add Project" to get started!
            </p>
          </div>
        ) : (
          <div className="p-0 overflow-x-auto shadow-2xl rounded-xl border border-gray-100">
            <table className="min-w-full bg-white text-sm md:text-base">
              <thead className="bg-indigo-100 border-b border-indigo-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-indigo-700">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-indigo-700 hidden md:table-cell">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-indigo-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-indigo-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr
                    key={proj._id}
                    className="border-b border-gray-200 hover:bg-indigo-50 transition duration-150"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800 truncate max-w-xs">
                      {proj.title}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell truncate max-w-sm">
                      {proj.description}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-semibold uppercase shadow-sm ${
                          proj.status === "active"
                            ? "bg-blue-600" // Deeper blue for active
                            : "bg-green-600" // Deeper green for completed
                        }`}
                      >
                        {proj.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-2 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(proj)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 text-xs md:text-sm font-medium transition duration-150"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/projects/${proj._id}/tasks`, {
                            state: { projectName: proj.title },
                          })
                        }
                        className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 text-xs md:text-sm font-medium transition duration-150"
                      >
                        Tasks
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-xs md:text-sm font-medium transition duration-150"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ✨ Modal for Editing (Assuming Popup is styled professionally) */}
            {editingProject && (
              <Popup
                editingProject={editingProject}
                setEditingProject={setEditingProject}
                handleSaveEdit={handleSaveEdit}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDashboard;
