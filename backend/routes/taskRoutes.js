import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

import { requireAuth, requireTaskOwnership } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

// Protect all task routes
router.use(requireAuth);

// Get all tasks for a project (ownership checked in projectRoutes)
router.get("/", getTasks);

// Create a task for a project (ownership checked in projectRoutes)
router.post("/", createTask);

// Update a task by ID (verify task ownership)
router.put("/:taskId", requireTaskOwnership, updateTask);

// Delete a task by ID (verify task ownership)
router.delete("/:taskId", requireTaskOwnership, deleteTask);

export default router;
