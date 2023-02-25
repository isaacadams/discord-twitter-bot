'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TwitterUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TwitterUser.init(
    {
      userid: DataTypes.NUMBER,
      username: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'TwitterUser',
    }
  );
  return TwitterUser;
};
