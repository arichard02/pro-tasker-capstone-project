import Task from "../models/Task.js";
import Project from "../models/Project.js";

// Create task
export const createTask = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const { title, description, status } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      project: project._id,
    });

    project.tasks.push(task._id);
    await project.save();

    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
};

// Get tasks
export const getTasks = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const tasks = await Task.find({ project: project._id });

    res.status(200).json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId).populate("project");

    if (!task || task.project.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: "Task not found" });
    }

    const { project, ...updateData } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      updateData,
      { new: true },
    );

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
 
  try {

    const task = await Task.findById(req.params.taskId).populate("project");

    if (!task || task.project.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
};
