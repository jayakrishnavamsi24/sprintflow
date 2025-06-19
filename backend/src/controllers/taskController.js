const Task = require("../models/Task");
const User = require("../models/User");

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, deadline, projectId, assignedTo } = req.body;

    const newTask = await Task.create({
      title,
      description,
      status,
      deadline,
      projectId,
      assignedTo,
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Task creation error:", err);
    res.status(500).json({ message: "Task creation failed" });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [
        { model: User, as: "assignee", attributes: ["id", "name", "email"] },
      ],
    });

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Could not fetch tasks" });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: User, as: "assignee", attributes: ["id", "name", "email"] },
      ],
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (err) {
    console.error("Single fetch error:", err);
    res.status(500).json({ message: "Could not get task" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole !== "Admin" && userRole !== "Manager" && task.assignedTo !== userId) {
      return res.status(403).json({ message: "Not allowed to update this task" });
    }

    const { title, description, status, deadline, assignedTo } = req.body;

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.deadline = deadline || task.deadline;
    task.assignedTo = assignedTo || task.assignedTo;

    await task.save();

    res.status(200).json(task);
  } catch (err) {
    console.error("Task update error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.destroy();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Task delete error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};
