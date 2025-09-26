import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createProject,
  deleteProjectById,
  listUserProjects,
  updateProjectById,
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post("/", authMiddleware, createProject);
projectRouter.get("/", authMiddleware, listUserProjects);
projectRouter.put("/:id", authMiddleware, updateProjectById);
projectRouter.delete("/:id", authMiddleware, deleteProjectById);

export default projectRouter;
