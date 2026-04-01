import Task from "../models/Task.js";

// Create task
export const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      project: req.params.projectId,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get tasks for a project
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
