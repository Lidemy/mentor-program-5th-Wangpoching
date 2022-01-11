'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Article.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
    }
  };
  Article.init({
    userId: DataTypes.STRING,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    plainContent: DataTypes.TEXT,
    csrfToken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};