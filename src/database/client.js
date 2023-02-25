const { Sequelize } = require('sequelize');
const config = require('../../config/config');
const env = require('../env');

const orm = new Sequelize(
  env.isProduction ? config.production : config.development
);

module.exports = {
  orm,
};
