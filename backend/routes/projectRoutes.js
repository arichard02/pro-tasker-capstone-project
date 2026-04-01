import express from "express";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { authMiddleware } from "../middleware/auth.js";
import taskRoutes from "./taskRoutes.js";

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// Nested task routes
router.use("/:projectId/tasks", taskRoutes);

// PROJECT ROUTES

// CREATE PROJECT
router.post("/", async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      owner: req.user._id,
    });

    await project.populate("owner", "username");

    res.status(201).json(project);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});

// GET ALL PROJECTS (for logged-in user only)
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .populate("owner", "username");

    res.status(200).json(projects);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});

// GET SINGLE PROJECT
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    }).populate("owner", "username");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE PROJECT
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true },
    ).populate("owner", "username");

    if (!project) {
      return res.status(404).json({ message: "Not authorized or not found" });
    }

    res.status(200).json(project);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});

// DELETE PROJECT
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Not authorized or not found" });
    }

    // Delete all tasks related to this project
    await Task.deleteMany({ project: req.params.id });

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});

export default router;
