// backend/controllers/taskController.js
import Task from "../models/Task.js";
import Project from "../models/Project.js";

// GET all tasks for a project
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE a task for a project
export const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Check if project exists
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const task = await Task.create({
      title,
      description,
      status: status || "To Do",
      project: req.params.projectId,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a task by ID
export const updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.taskId, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ error: "Task not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE a task by ID
export const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.taskId);
    if (!deleted) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};