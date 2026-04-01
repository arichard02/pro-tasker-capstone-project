import Project from "../models/Project.js";

// Get all projects owned by logged-in user
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

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      owner: req.user._id, // assign logged-in user as owner
    });

    res.status(201).json(project);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

// Get a single project by ID (only if user is owner)
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

// Update a project (only owner can update)
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.projectId, owner: req.user._id },
      req.body,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found or not authorized" });
    }

    res.status(200).json(project);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

// Delete a project (only owner can delete)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found or not authorized" });
    }

    res.status(200).json({ message: "Project deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};