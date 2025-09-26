import projectModel from "../models/projectModel.js";
import taskModel from "../models/taskModel.js";
import mongoose from "mongoose";

export const createTask = async (req, res) => {
  try {
    const { projectId, title, description, dueDate } = req.body;
    if (!projectId || !title || !dueDate) {
      return res
        .status(400)
        .json({ success: false, msg: "ProjectId, title and dueDate required" });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid projectId format" });
    }

    const project = await projectModel.findOne({
      _id: projectId,
      user: req.user._id,
    });
    if (!project) {
      return res.status(404).json({ success: true, msg: "Project not found" });
    }

    const task = await taskModel.create({
      project: projectId,
      title,
      description,
      dueDate,
    });

    res.status(201).json({ success: true, msg: "project created", data: task });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal server error." });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, msg: "Invalid task ID" });
    }

    const task = await taskModel.findById(id).populate("project");
    if (!task || String(task.project.user) !== String(req.user._id)) {
      return res.status(404).json({ success: false, msg: "Task not found or not yours" });
    }

    const { title, description, status, dueDate } = req.body;
    if (status && !["todo", "in-progress", "done"].includes(status)) {
      return res.status(400).json({ success: false, msg: "Invalid status" });
    }

    Object.assign(task, { 
      title: title ?? task.title,
      description: description ?? task.description,
      status: status ?? task.status,
      dueDate: dueDate ?? task.dueDate
    });

    await task.save();
    res.json({ success: true, msg: "Task updated", data: task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal server error." });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, msg: "Invalid task ID" });
    }

    const task = await taskModel.findById(id).populate("project");
    if (!task || String(task.project.user) !== String(req.user._id)) {
      return res.status(404).json({ success: false, msg: "Task not found or not yours" });
    }

    await task.deleteOne();
    res.json({ success: true, msg: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal server error." });
  }
};

export const filterTask = async (req, res) => {
  try {
    const { status, projectId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (projectId) filter.project = projectId;

    const tasks = await taskModel.find(filter).populate("project");
    res.status(200).json({ success: true, msg: "Tasks fetched", data: tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal server error." });
  }
};
