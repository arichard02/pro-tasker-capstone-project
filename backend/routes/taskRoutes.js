import express from "express";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

// CREATE TASK
router.post("/", async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res
        .status(403)
        .json({ message: "Not authorized for this project" });
    }

    const task = await Task.create({
      ...req.body,
      project: projectId,
      owner: req.user._id,
    });

    res.status(201).json(task);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});

// GET TASKS
router.get("/", async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const tasks = await Task.find({
      project: projectId,
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE TASK
router.put("/:taskId", async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    const task = await Task.findOneAndUpdate(
      {
        _id: taskId,
        project: projectId,
        owner: req.user._id,
      },
      req.body,
      { new: true },
    );

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized" });
    }

    res.status(200).json(task);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});

// DELETE TASK
router.delete("/:taskId", async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      project: projectId,
      owner: req.user._id,
    });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});

export default router;
