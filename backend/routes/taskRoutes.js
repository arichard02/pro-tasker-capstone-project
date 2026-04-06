import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import {
  requireAuth,
  requireProjectOwnership,
  requireTaskOwnership,
} from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

router.use(requireAuth);

// Ensure user owns the project for all task routes
router.get("/", requireProjectOwnership, getTasks);
router.post("/", requireProjectOwnership, createTask);
router.put("/:taskId", requireTaskOwnership, updateTask);
router.delete("/:taskId", requireTaskOwnership, deleteTask);

export default router;
