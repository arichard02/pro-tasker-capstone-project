import express from "express";
import mongoose from "mongoose";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

import taskRoutes from "./taskRoutes.js";
import { requireAuth, requireProjectOwnership } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

// Helper to validate ObjectId
const validateObjectId = (param) => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  next();
};

router.post("/", createProject);
router.get("/", getProjects);
router.get(
  "/:projectId",
  validateObjectId("projectId"),
  requireProjectOwnership,
  getProjectById,
);
router.put(
  "/:projectId",
  validateObjectId("projectId"),
  requireProjectOwnership,
  updateProject,
);
router.delete(
  "/:projectId",
  validateObjectId("projectId"),
  requireProjectOwnership,
  deleteProject,
);

// Nested task routes
// /api/projects/:projectId/tasks (GET)
// /api/projects/:projectId/tasks (POST)
// /api/projects/:projectId/tasks/:taskId (PUT)
// /api/projects/:projectId/tasks/:taskId (DELETE)
router.use(
  "/:projectId/tasks",
  validateObjectId("projectId"),
  requireProjectOwnership,
  taskRoutes,
);

export default router;
