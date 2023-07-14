'use strict';
const {
  Model, HasMany
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lobby extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  Lobby.init({
    usersNumber: DataTypes.INTEGER,
    userId1: DataTypes.INTEGER,
    user1IsReady: DataTypes.BOOLEAN,
    userId2: DataTypes.INTEGER,
    user2IsReady: DataTypes.BOOLEAN,
    userId3: DataTypes.INTEGER,
    user3IsReady: DataTypes.BOOLEAN,
    userId4: DataTypes.INTEGER,
    user4IsReady: DataTypes.BOOLEAN,
    gameId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Lobby',
  });
  return Lobby;
};