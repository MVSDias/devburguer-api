'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'category_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'categories', // a q tabela se refere
        key: 'id' // a key é o id da tabela de categories
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true
    });
    // crio uma coluna chamada 'category_id' na tabela de 'products', e essa coluna tem o 'type Integer' pq o id da tabela de categories é integer. O campo categoru_id é a mesma coisa que o campo id da tabela de categories, por isso a chave é o id dessa tabela(categories). On Update - toda vez que o id da tabela categories sofrer um 'update', o mesmo ocorrerá na tabela de products no campo category_id. onDelete - toda vez que o id for deletado na tabela de categories, ele será nulo na coluna category_id da tabela de products.
    
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('products', 'category_id');
    
  }
};
