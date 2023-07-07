'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      playersCount: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      gameOver: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      playerInTurn: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      boardSize: {
        defaultValue: 7,
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
    await queryInterface.dropTable('Games');
  }
};