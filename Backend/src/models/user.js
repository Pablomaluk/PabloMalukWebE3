'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Player, {
        foreignKey: 'userId',
      });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      validate: { 
        isAlphanumeric: {
          msg: "Username can only contain letters and numbers"
        } 
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        hasValidLength: (value) => {
          if (value.length < 8){
            throw new Error("Password must contain at least 8 characters")
          }
          if (value.length > 20){
            throw new Error("Password can't contain more than 20 characters")
          }
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: { 
        isEmail: {
          msg: "Must be a valid email address"
        } 
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};