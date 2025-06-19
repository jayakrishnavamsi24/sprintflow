const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
  },

  status: {
    type: DataTypes.ENUM("To Do", "In Progress", "Done"),
    defaultValue: "To Do",
  },

  deadline: {
    type: DataTypes.DATE,
  },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Comment = require("./Comment");

Task.hasMany(Comment, { foreignKey: "taskId" });
Comment.belongsTo(Task, { foreignKey: "taskId" });

module.exports = Task;
