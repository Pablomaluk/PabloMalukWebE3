'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Lobbies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usersNumber: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      userId1: {
        allowNull: true,
        default: null,
        type: Sequelize.INTEGER
      },
      user1IsReady: {
        allowNull: true,
        default: null,
        type: Sequelize.BOOLEAN
      },
      userId2: {
        allowNull: true,
        default: null,
        type: Sequelize.INTEGER
      },
      user2IsReady: {
        allowNull: true,
        default: null,
        type: Sequelize.BOOLEAN
      },
      userId3: {
        allowNull: true,
        default: null,
        type: Sequelize.INTEGER
      },
      user3IsReady: {
        allowNull: true,
        default: null,
        type: Sequelize.BOOLEAN
      },
      userId4: {
        allowNull: true,
        default: null,
        type: Sequelize.INTEGER
      },
      user4IsReady: {
        allowNull: true,
        default: null,
        type: Sequelize.BOOLEAN
      },
      gameId: {
        allowNull: true,
        default: null,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Lobbies');
  }
};