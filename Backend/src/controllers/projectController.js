import projectModel from "../models/projectModel.js";

export const createProject = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ success: false, msg: "Title and description required" });
    }
    if (status && !["active", "completed"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid project status" });
    }

    const project = await projectModel.create({
      user: req.user._id,
      title,
      description,
      status: status ?? "active",
    });

    res
      .status(201)
      .json({ success: true, msg: "Project created", data: project });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal server error." });
  }
};

export const listUserProjects = async (req, res) => {
  try {
    const projects = await projectModel.find({ user: req.user?._id });
    if (!projects || projects.length == 0) {
      return res.status(200).json({ success: true, msg: "Empty project list" });
    }

    res
      .status(200)
      .json({ success: true, msg: "Projetct list", data: projects });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal server error." });
  }
};

export const updateProjectById = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const id = req.params.id;
    if (!id)
      return res.status(400).json({ success: false, msg: "ID not provided" });

    const project = await projectModel.findOne({ _id: id, user: req.user._id });
    if (!project)
      return res.status(404).json({ success: false, msg: "Project not found" });

    if (status && !["active", "completed"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid project status" });
    }

    Object.assign(project, {
      title: title ?? project.title,
      description: description ?? project.description,
      status: status ?? project.status,
    });

    await project.save();
    res
      .status(200)
      .json({ success: true, msg: "Project updated", data: project });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal server error." });
  }
};

export const deleteProjectById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ success: false, msg: "ID not provided" });
    }

    await projectModel.deleteOne({ _id: id, user: req.user._id });
    res.status(200).json({ success: true, msg: "Project deleted" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal server error." });
  }
};
