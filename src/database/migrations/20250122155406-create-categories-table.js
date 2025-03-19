'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.INTEGER, // numero inteiro -> 1,2,3,...
        allowNull: false,
        primaryKey: true,
        autoIncrement: true, //vai aumentando 1 a cada produto criado
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    
  },

  async down(queryInterface) {
   await queryInterface.dropTable('categories');
    
  },
};
