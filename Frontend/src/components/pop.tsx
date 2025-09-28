import React from "react";

type Project = {
  _id: string;
  title: string;
  description: string;
  status: "active" | "completed";
};

type PopupProps = {
  editingProject: Project;
  setEditingProject: (project: Project | null) => void;
  handleSaveEdit: () => void;
};

const Popup: React.FC<PopupProps> = ({
  editingProject,
  setEditingProject,
  handleSaveEdit,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit </h2>

        {/* Title */}
        <label className="block mb-2">
          Title
          <input
            type="text"
            className="w-full border p-2 rounded mt-1"
            value={editingProject.title}
            onChange={(e) =>
              setEditingProject({
                ...editingProject,
                title: e.target.value,
              })
            }
          />
        </label>

        {/* Description */}
        <label className="block mb-2">
          Description
          <textarea
            className="w-full border p-2 rounded mt-1"
            value={editingProject.description}
            onChange={(e) =>
              setEditingProject({
                ...editingProject,
                description: e.target.value,
              })
            }
          />
        </label>

        {/* Status */}
        <label className="block mb-4">
          Status
          <select
            className="w-full border p-2 rounded mt-1"
            value={editingProject.status}
            onChange={(e) =>
              setEditingProject({
                ...editingProject,
                status: e.target.value as Project["status"],
              })
            }
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setEditingProject(null)}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            ✅ Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
