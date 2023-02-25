const { Sequelize } = require('sequelize');
const { production, development } = require('../../config/config');
const env = require('../env');

const config = env.isProduction ? production : development;
const orm = new Sequelize(config);

module.exports = {
  orm,
  config,
};
