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

//         <h2 className="text-lg font-semibold mb-2">Project Lists</h2>
//         {projects.length === 0 ? (
//           <p className="text-gray-500">No projects available.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-gray-600 font-medium">
//                     Title
//                   </th>
//                   <th className="px-4 py-3 text-left text-gray-600 font-medium">
//                     Description
//                   </th>
//                   <th className="px-4 py-3 text-left text-gray-600 font-medium">
//                     Status
//                   </th>
//                   <th className="px-4 py-3 text-gray-600 font-medium">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {projects.map((proj) => {
//                   const isEditing = editingProjectId === proj._id;
//                   return (
//                     <tr
//                       key={proj._id}
//                       className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
//                     >
//                       {/* Title */}
//                       <td className="px-4 py-2">
//                         {isEditing ? (
//                           <input
//                             className="w-full border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 p-1 text-lg font-semibold"
//                             value={editFormData?.title || ""}
//                             onChange={(e) =>
//                               setEditFormData({
//                                 ...editFormData!,
//                                 title: e.target.value,
//                               })
//                             }
//                           />
//                         ) : (
//                           <span className="font-semibold">{proj.title}</span>
//                         )}
//                       </td>

//                       {/* Description */}
//                       <td className="px-4 py-2">
//                         {isEditing ? (
//                           <textarea
//                             className="w-full border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
//                             rows={1}
//                             value={editFormData?.description || ""}
//                             onChange={(e) =>
//                               setEditFormData({
//                                 ...editFormData!,
//                                 description: e.target.value,
//                               })
//                             }
//                           />
//                         ) : (
//                           <span>{proj.description}</span>
//                         )}
//                       </td>

//                       {/* Status */}
//                       <td className="px-4 py-2">
//                         {isEditing ? (
//                           <select
//                             className="w-full border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
//                             value={editFormData?.status || "active"}
//                             onChange={(e) =>
//                               setEditFormData({
//                                 ...editFormData!,
//                                 status: e.target.value as Project["status"],
//                               })
//                             }
//                           >
//                             <option value="active">Active</option>
//                             <option value="completed">Completed</option>
//                           </select>
//                         ) : (
//                           <span
//                             className={`px-2 py-1 rounded text-white ${
//                               proj.status === "active"
//                                 ? "bg-blue-500"
//                                 : "bg-green-500"
//                             }`}
//                           >
//                             {proj.status}
//                           </span>
//                         )}
//                       </td>

//                       {/* Actions */}
//                       <td className="px-4 py-2 text-center space-x-2">
//                         {isEditing ? (
//                           <button
//                             onClick={() => handleSaveProject(proj._id)}
//                             className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-200"
//                           >
//                             Save
//                           </button>
//                         ) : (
//                           <button
//                             onClick={() => {
//                               setEditingProjectId(proj._id);
//                               setEditFormData({
//                                 title: proj.title,
//                                 description: proj.description,
//                                 status: proj.status,
//                               });
//                             }}
//                             className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-colors duration-200"
//                           >
//                             Edit
//                           </button>
//                         )}

//                         <button
//                           onClick={() => handleDeleteProject(proj._id)}
//                           className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200"
//                         >
//                           Delete
//                         </button>

//                         <button
//                           onClick={() =>
//                             navigate(`/projects/${proj._id}/tasks`)
//                           }
//                           className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors duration-200"
//                         >
//                           Tasks
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
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

  const [editingProject, setEditingProject] = useState<Project | null>(null);


  useEffect(() => {
    const fetchProjects = async () => {
      try {

        setIsLoading(true);
        const res = await API.get("/");

        const res = await API.get("/api/v1/project");
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


  // ✅ Create 
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

          <div className="w-full md:w-48">
            <button
              onClick={handleAddProject}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition duration-300 shadow-md transform hover:scale-[1.02] active:scale-100"

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
