import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, status } = req.body;
    const task = await Task.create({
      title,
      status,
      project: req.params.projectId,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      project: req.params.projectId,
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
