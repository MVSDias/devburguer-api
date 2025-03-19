/*
  configuração das models - conecta as models com o banco, para fazerem as operações necessárias (CRUD)
*/

import Sequelize from 'sequelize';
import configDatabase from '../config/database';
import User from '../app/models/User';
import Product from '../app/models/Product';
import Category from '../app/models/Category';
import mongoose from 'mongoose';

const models = [User, Product, Category]; // crio um array para armazenar as models e depois poder mapeá-las

class Database {
  constructor() {
    // ao iniciar já chamo o metodo init
    this.init();
    this.mongo()
  }

  init() {
    this.connection = new Sequelize(configDatabase);
    models
      .map((model) => model.init(this.connection))
      .map((model) => model.associate && model.associate(this.connection.models));
    // 1º map - para cada model existente chamo o método init e passo essa conexão com o banco. todas as models usarão a mesma conexão.
    // 2º map - para cada model verifico se existe o método associate(relacionamento) criado na model, e se existir passo as models que já conectaram.
    // && => se isso existe && faço o q vem após
  }

  mongo() {
    this.mongoConnection = mongoose.connect('mongodb://localhost:27017/devburguer') // passo uma string de conexão e escolho o nome da base de dados,no caso devburguer
  }
}

export default new Database(); //export estânciando


