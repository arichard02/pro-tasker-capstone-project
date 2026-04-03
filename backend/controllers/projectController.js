import Project from "../models/Project.js";
import Task from "../models/Task.js";

// GET all projects for the logged-in user
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    // Optional: include task counts
    const projectsWithTasks = await Promise.all(
      projects.map(async (proj) => {
        const taskCount = await Task.countDocuments({ project: proj._id });
        return {
          _id: proj._id,
          name: proj.name,
          description: proj.description,
          createdAt: proj.createdAt,
          updatedAt: proj.updatedAt,
          taskCount,
        };
      }),
    );
    res.json(projectsWithTasks);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id,
    });
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Include tasks for this project
    const tasks = await Task.find({ project: project._id });

    res.json({ ...project.toObject(), tasks });
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE a project
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
    console.error("Error creating project:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE a project by ID
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id,
    });
    if (!project) return res.status(404).json({ error: "Project not found" });

    const { name, description } = req.body;
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;

    await project.save();

    res.json(project);
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE a project by ID
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.projectId,
      owner: req.user._id,
    });
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Delete all tasks under this project
    await Task.deleteMany({ project: project._id });

    res.json({ message: "Project deleted", projectId: project._id });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: "Server error" });
  }
};
