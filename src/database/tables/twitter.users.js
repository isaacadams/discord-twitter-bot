const Sequelize = require('sequelize');
const { orm } = require('../client');

const TwitterUsers = orm.define('twitter_users', {
  userid: {
    type: Sequelize.NUMBER,
    unique: true,
  },
  username: Sequelize.STRING,
});

module.exports = {
  TwitterUsers,
};
