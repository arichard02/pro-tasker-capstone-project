import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    const projectsWithTasks = await Promise.all(
      projects.map(async (proj) => {
        const taskCount = await Task.countDocuments({ project: proj._id });
        return { ...proj.toObject(), taskCount };
      }),
    );
    res.json(projectsWithTasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id,
    });
    if (!project) return res.status(404).json({ error: "Project not found" });

    const tasks = await Task.find({ project: project._id }).sort({
      createdAt: 1,
    });
    res.json({ ...project.toObject(), tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description)
      return res.status(400).json({ error: "Name and description required" });

    const newProject = await Project.create({
      name,
      description,
      owner: req.user._id,
    });
    res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: req.params.projectId, owner: req.user._id },
      req.body,
      { new: true },
    );
    if (!updatedProject)
      return res.status(404).json({ error: "Project not found" });

    res.json(updatedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.projectId,
      owner: req.user._id,
    });
    if (!project) return res.status(404).json({ error: "Project not found" });

    await Task.deleteMany({ project: project._id });
    res.json({ message: "Project deleted", projectId: project._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
