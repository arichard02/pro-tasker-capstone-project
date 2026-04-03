import Project from "../models/project.js";
import Task from "../models/task.js"; 

// CREATE project
export const createProject = async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, owner: req.user._id });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET all projects for logged-in user
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id });   
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET a single project by ID
export const getProjectById = async (req, res) => {
  try {
  const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE 
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    Object.assign(project, req.body);
    await project.save();
    res.status(200).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// DELETE a project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    // Optionally: Delete all tasks associated with this project
    await Task.deleteMany({ project: project._id });

    await project.deleteOne();

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
