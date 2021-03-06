/* eslint-disable */
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CartDetail.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
      CartDetail.belongsTo(models.Menu, {
        foreignKey: 'dishId',
        onDelete: 'CASCADE'
      })
    }
  };
  CartDetail.init({
    userId: DataTypes.INTEGER,
    dishId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CartDetail',
  });
  return CartDetail;
};