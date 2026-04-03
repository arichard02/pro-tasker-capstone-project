import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router({ mergeParams: true }); 

// Protect all task routes
router.use(protect);

// GET all tasks for a project
router.get("/", getTasks);

// CREATE a task for a project
router.post("/", createTask);

// UPDATE a task by ID
router.put("/:taskId", updateTask);

// DELETE a task by ID
router.delete("/:taskId", deleteTask);

export default router;
