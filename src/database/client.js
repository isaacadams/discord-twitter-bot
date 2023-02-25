const { Sequelize } = require('sequelize');
const config = require('./config');

const orm = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: config.pathToDatabase,
});

module.exports = {
  orm,
};
