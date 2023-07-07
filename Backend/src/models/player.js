'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
      });
      this.belongsTo(models.Game, {
        foreignKey: 'gameId'
      });
      this.hasMany(models.City, {
        foreignKey: 'playerId',
      });
      this.hasMany(models.Warrior, {
        foreignKey: 'playerId',
      });
    }
  }
  Player.init({
    gamePlayerNumber: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 3,
      },
    },
    userId: DataTypes.INTEGER,
    gameId: DataTypes.INTEGER,
    gold: DataTypes.INTEGER,
    gameOver: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};