'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Player, {
        foreignKey: 'gameId',
      });
      this.hasMany(models.Gold, {
        foreignKey: 'gameId',
      });
      this.hasMany(models.City, {
        foreignKey: 'gameId',
      });
      this.hasMany(models.Warrior, {
        foreignKey: 'gameId',
      });
    }
  }
  Game.init({
    playersCount: {
      type: DataTypes.INTEGER,
      validate: {
        min: 2,
        max: 4,
      },
    },
    gameOver: DataTypes.BOOLEAN,
    playerInTurn: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 3,
      },
    },
    boardSize: {
      type: DataTypes.INTEGER,
      validate: {
        min: 7,
        max: 15,
      },
    }
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};