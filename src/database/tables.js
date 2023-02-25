const { Sequelize } = require('sequelize');
const { orm } = require('./client');
const twitteruser = require('../../models/twitteruser');

module.exports = {
  TwitterUsers: twitteruser(orm, Sequelize),
};
