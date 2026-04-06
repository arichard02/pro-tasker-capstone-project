import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const requireAuth = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const requireProjectOwnership = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.project = project;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid request" });
  }
};

export const requireTaskOwnership = async (req, res, next) => {

  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const task = await Task.findById(req.params.taskId).populate("project");

    if (!task || task.project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.task = task;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid request" });
  }
};
