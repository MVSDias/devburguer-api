'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.removeColumn('products', 'category'); // vai excluir a coluna category da tabela de products
   
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'category', {
      type: Sequelize.STRING,
      allowNull: true // preciso permitir nulo p vai cria esse campo em branco
    });
    
  }
};
