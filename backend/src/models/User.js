const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  role: {
    type: DataTypes.ENUM('Admin', 'Manager', 'Developer'),
    defaultValue: 'Developer'
  }
});

const Project = require("./Project");

User.hasMany(Project, { foreignKey: "createdBy" });
Project.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

const Task = require("./Task");

User.hasMany(Task, { foreignKey: "assignedTo" });
Task.belongsTo(User, { foreignKey: "assignedTo", as: "assignee" });

const Comment = require("./Comment");

User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });


module.exports = User;
