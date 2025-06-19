const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'sqlite',
  logging: false,
});

module.exports = sequelize;
