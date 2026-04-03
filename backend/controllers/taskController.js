import Task from "../models/task.js";
import Project from "../models/project.js";

// GET all tasks for a project
export const getTasks = async (req, res) => {
  try {
    const { id: projectId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      owner: req.user.id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const tasks = await Task.find({ project: projectId });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE a task for a project
export const createTask = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { title, description } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const project = await Project.findOne({
      _id: projectId,
      owner: req.user.id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = await Task.create({ title, description, project: projectId });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE a task
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status } = req.body;

    const task = await Task.findById(taskId).populate("project");
    if (!task || task.project.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE a task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate("project");
    if (!task || task.project.owner.toString() !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }


    await Task.findByIdAndDelete(taskId);
    
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
