'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Player, {
        foreignKey: 'playerId',
      });
      this.belongsTo(models.Game, {
        foreignKey: 'gameId'
      });
    }
  }
  City.init({
    gameId: DataTypes.INTEGER,
    playerId: DataTypes.INTEGER,
    x: DataTypes.INTEGER,
    y: DataTypes.INTEGER,
    level: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'City',
  });
  return City;
};