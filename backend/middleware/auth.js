import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

// Authenticate user using JWT
export const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Verify ownership of a project
export const requireProjectOwnership = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });
    if (project.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Forbidden" });
    req.project = project;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid request" });
  }
};

// Verify ownership of a task
export const requireTaskOwnership = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const project = await Project.findById(task.project);
    if (!project || project.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Forbidden" });

    req.task = task;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid request" });
  }
};
