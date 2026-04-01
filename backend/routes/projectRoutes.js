import express from "express";
import Project from "../models/Project.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

// CREATE a new project
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

// GET all projects for the logged-in user
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

// DELETE a project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.owner.toString() !== req.user._id)
      return res.status(403).json({ message: "User does not own this project" });

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});

export default router;