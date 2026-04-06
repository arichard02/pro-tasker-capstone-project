import Project from "../models/Project.js";

// Create
export const createProject = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
};

// Get all
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.user._id,
    }).populate("tasks");

    res.status(200).json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
};

// Get one
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id,
    }).populate("tasks");

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(project);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
};

// Update
export const updateProject = async (req, res) => {
  try {
    const { owner, ...updateData } = req.body;

    const updatedProject = await Project.findOneAndUpdate(
      { _id: req.params.projectId, owner: req.user._id },
      updateData,
      { new: true },
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
};

// Delete
export const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findOneAndDelete({
      _id: req.params.projectId,
      owner: req.user._id,
    });

    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
};
