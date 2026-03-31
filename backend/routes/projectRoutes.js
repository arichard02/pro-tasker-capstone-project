import express from "express";
import { createProject, getProjects } from "../controllers/projectController.js";
import { createTask, getTasks } from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .post(createProject)
  .get(getProjects);

router.route("/:projectId/tasks")
  .post(createTask)
  .get(getTasks);

export default router;