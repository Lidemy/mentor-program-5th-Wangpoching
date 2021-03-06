/* eslint-disable */
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Category, {
        foreignKey: 'userId'
      })
      User.hasMany(models.About, {
        foreignKey: 'userId'
      })
      User.hasMany(models.Article, {
        foreignKey: 'userId'
      })
    }
  };
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    blogname: DataTypes.STRING,
    desc: DataTypes.STRING,
    sitename: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};