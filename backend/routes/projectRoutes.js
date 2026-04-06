import express from "express";
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

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:projectId", requireProjectOwnership, getProjectById);
router.put("/:projectId", requireProjectOwnership, updateProject);
router.delete("/:projectId", requireProjectOwnership, deleteProject);

// Nested task routes
router.use("/:projectId/tasks", requireProjectOwnership, taskRoutes);

export default router;
