const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserStory = sequelize.define("UserStory", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = UserStory;