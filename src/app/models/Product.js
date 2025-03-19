import Sequelize, { Model } from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.INTEGER,
        path: Sequelize.STRING,
        offer: Sequelize.BOOLEAN,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3001/product-file/${this.path}`;
          },
          // toda vez q recuperar o produto do banco (atraves do cliente ou frontend), vai gerar o campo vitual url com uma função get() retornando a url da imagem
        },
      },
      {
        sequelize,
      },
    );
    return this;
  }
  static associate(models) {
    // recebo as models no metodo associate
    this.belongsTo(models.Category, {
      // como posso ter vários produtos dentro de uma categoria, o produto pertence a categoria
      foreignKey: 'category_id', // a chave estrangeira é a coluna category_id que recebe a key id da categories
      as: 'category', // todas as informações salvas na propriedade category criada
    });
  }
}
export default Product;
