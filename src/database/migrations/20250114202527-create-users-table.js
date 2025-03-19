'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // crio a tabela
    await queryInterface.createTable('users', {
      id: {
        primaryKey: true, // chave primaria de identificação do registro
        allowNull: false, //não permite ser nulo
        type: Sequelize.UUID, // id unico
        defaultValue: Sequelize.UUIDV4, // valor padrão da versão v4 do uuid
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // se não especificar será falso
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
    // excluo a tabela
    await queryInterface.dropTable('users');
  },
};
