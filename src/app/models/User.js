// essa é a inteface de usuários que tem no banco. nesse arquivo nosso código sabera tudoo q existe na tabela de usuários. Tanto o id (que por ser primaryKey o sequelize já entende q existe), tanto o created_at e o updated_at (por serem timestamps true) não precisam ser colocados.

import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
  // User herda os métodos da Model
  static init(sequelize) {
    // não preciso instanciar por causa do static
    super.init(
      {
        // super - aviso q vou usar o init da class pai Model
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      },
    );

    this.addHook('beforeSave', async (user) => {
      // this.addhook adiciona uma ação, no caso, antes de salvar, e passo uma função callback
      if (user.password) {
        // se tem user.password
        user.password_hash = await bcrypt.hash(user.password, 10); // user.password_hash recebe user.password criptografada pelo bcrypt na 'força' 10
      }
    });

    

    return this;
  }

  async checkPassword(password){ // crio o metodo checkPassword e passo o password
    return bcrypt.compare(password, this.password_hash) // uso o método compare do bcrypt p comparar o password com o password_hash. esse método checkPassword será usado no sessioncontroller
  }
}

export default User;
