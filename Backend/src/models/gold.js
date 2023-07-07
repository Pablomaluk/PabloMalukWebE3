'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gold extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Game, {
        foreignKey: 'gameId'
      });
    }
  }
  Gold.init({
    gameId: DataTypes.INTEGER,
    x: DataTypes.INTEGER,
    y: DataTypes.INTEGER,
    amount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Gold',
  });
  return Gold;
};