import Sequelize, { Model } from 'sequelize';

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
                  type: Sequelize.VIRTUAL,
                  get() {
                    return `http://localhost:3001/category-file/${this.path}`;
                  },
                  // toda vez q recuperar o category do banco (atraves do cliente ou frontend), vai gerar o campo vitual url com uma função get() retornando a url da imagem
                },
      },
      {
        sequelize,
      },
    );
    return this;
  }
}
export default Category;
