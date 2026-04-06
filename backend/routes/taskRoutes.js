import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { requireAuth, requireTaskOwnership } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

router.use(requireAuth);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:taskId", requireTaskOwnership, updateTask);
router.delete("/:taskId", requireTaskOwnership, deleteTask);

export default router;
