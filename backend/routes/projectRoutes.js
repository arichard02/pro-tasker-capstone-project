import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import taskRoutes from "./taskRoutes.js"; 

const router = express.Router();

// Protect all project routes
router.use(protect);

// CREATE a project
router.post("/", createProject);

// GET all projects for the logged-in user
router.get("/", getProjects);

// GET a single project by ID
router.get("/:id", getProjectById);

// UPDATE a project by ID
router.put("/:id", updateProject);

// DELETE a project by ID
router.delete("/:id", deleteProject);

// Mount task routes for a project
router.use("/:id/tasks", taskRoutes);

export default router;
