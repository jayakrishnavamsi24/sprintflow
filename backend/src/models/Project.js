const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Project = sequelize.define("Project", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
  },

  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Task = require("./Task");

Project.hasMany(Task, { foreignKey: "projectId" });
Task.belongsTo(Project, { foreignKey: "projectId" });

const UserStory = require("./UserStory");

Project.hasMany(UserStory, { foreignKey: "projectId" });
UserStory.belongsTo(Project, { foreignKey: "projectId" });


module.exports = Project;
