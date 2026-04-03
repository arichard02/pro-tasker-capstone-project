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

// Protect all project routes
router.use(requireAuth);

// Create a new project
router.post("/", createProject);

// Get all projects for the logged-in user
router.get("/", getProjects);

// Get a single project by ID (only owner)
router.get("/:id", requireProjectOwnership, getProjectById);

// Update a project by ID (only owner)
router.put("/:id", requireProjectOwnership, updateProject);

// Delete a project by ID (only owner)
router.delete("/:id", requireProjectOwnership, deleteProject);

// Mount task routes under project (only owner can access)
router.use("/:id/tasks", requireProjectOwnership, taskRoutes);

export default router;
