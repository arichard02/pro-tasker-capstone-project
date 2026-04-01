import Project from "../models/Project.js";
import Task from "../models/Task.js";

// GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .populate("owner", "username email");

    res.status(200).json(projects);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      owner: req.user._id,
    });

    res.status(201).json(project);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

// GET SINGLE PROJECT
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id,
    }).populate("owner", "username email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

// UPDATE PROJECT
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.projectId, owner: req.user._id },
      req.body,
      { new: true },
    );

    if (!project) {
      return res.status(404).json({ message: "Not authorized" });
    }

    res.status(200).json(project);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Not authorized" });
    }

    // delete related tasks
    await Task.deleteMany({ project: req.params.projectId });

    await Project.findByIdAndDelete(req.params.projectId);

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};
