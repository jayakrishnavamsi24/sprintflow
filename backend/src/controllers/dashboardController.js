const Task = require("../models/Task");
const Project = require("../models/Project");
const { Op } = require("sequelize");

exports.taskStatusCount = async (req, res) => {
  try {
    const toDo = await Task.count({ where: { status: "To Do" } });
    const inProgress = await Task.count({ where: { status: "In Progress" } });
    const done = await Task.count({ where: { status: "Done" } });

    res.status(200).json({ toDo, inProgress, done });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch task status count" });
  }
};

exports.overdueTasks = async (req, res) => {
  try {
    const overdue = await Task.findAll({
      where: {
        status: { [Op.not]: "Done" },
        deadline: { [Op.lt]: new Date() }
      }
    });

    res.status(200).json(overdue);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch overdue tasks" });
  }
};

exports.projectProgress = async (req, res) => {
  try {
    const projectId = req.params.id;

    const totalTasks = await Task.count({ where: { projectId } });
    const doneTasks = await Task.count({ where: { projectId, status: "Done" } });

    const progress = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

    res.status(200).json({ projectId, completionPercentage: progress });
  } catch (err) {
    res.status(500).json({ message: "Failed to calculate progress" });
  }
};