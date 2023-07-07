'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Gold', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gameId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {model: 'Games', key: 'id'},
      },
      x: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      y: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      amount: {
        allowNull: false,
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
    await queryInterface.dropTable('Gold');
  }
};