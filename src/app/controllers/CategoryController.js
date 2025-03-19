import * as Yup from 'yup';
import Category from '../models/Category';
import User from '../models/User';

class CategoryController {
  /*  ** criando as categorias** */
  async store(req, res) {
    // criando o schema
    const schema = Yup.object({
      name: Yup.string().required(),
    });

    // validando o  schema
    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    // verificando se o usuário é admin

    const { admin: isAdmin } = await User.findByPk(req.userId);
    // estou desestruturando o req e pegando apenas a propriedade admin e renomeando pra "isAdmin" por semântica pro código. procuro em User pela primaryKey enviada pelo token(req.userId)

    if (!isAdmin) {
      // se não for admin...
      return res.status(401).json();
    }

    // recuperando informações do req

    const { filename: path } = req.file;

    const { name } = req.body;

    // verificando se a categoria já existe
    const categoryExists = await Category.findOne({
      where: {
        name,
      },
    });

    if (categoryExists) {
      return res.status(401).json({ error: 'Category already exists' });
    }

    // criando/salvando o category no banco de dados
    const { id } = await Category.create({
      // desestruturo para pegar só o id
      name,
      path,
    });

    return res.status(201).json({ id, name, path }); // retorno o id e name, sem o created_at ou updated_at
  }

  /*  ** atualizando as categorias** */

  async update(req, res) {
    // criando o schema
    const schema = Yup.object({
      name: Yup.string(), // sem required() pq não sei se o name será atualizado
    });

    // validando o  schema
    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    // verificando se o usuário é admin

    const { admin: isAdmin } = await User.findByPk(req.userId);
    // estou desestruturando o req e pegando apenas a propriedade admin e renomeando pra "isAdmin" por semântica pro código. procuro em User pela primaryKey enviada pelo token(req.userId)

    if (!isAdmin) {
      // se não for admin...
      return res.status(401).json();
    }

    // recuperando o id do req.params
    const { id } = req.params;

    // verificando se a category existe pelo id passado
    const categoryExists = await Category.findByPk(id);

    if (!categoryExists) {
      return res.status(400).json({ message: 'Make sure your category ID is correct' });
    }

    // tornando o filename opcional - caso não atualize a imagem da category
    let path;
    if (req.file) {
      path = req.file.filename;
    }

    //recuperando o name do req.body
    const { name } = req.body;

    // verificando se o name foi atualizado
    if (name) {
      //verificando se o name da category já existe
      const categoryNameExists = await Category.findOne({
        where: {
          name,
        },
      });

      if (categoryNameExists && categoryNameExists.id !== +id) {
        // se o nome da categoria já existe é o id dessa mesma categoria for diferente do id passado na requisição...
        return res.status(400).json({ error: 'Category already exists' });
      }
    }

    // atualizando a category no banco de dados
    await Category.update(
      {
        name,
        path,
      },
      {
        where: {
          id,
        },
      },
    );

    return res.status(200).json();
  }

  /*  ** listando todas as categorias** */
  async index(req, res) {
    // método de indexação

    const categories = await Category.findAll(); // vou no banco, na tabela de categories e busco todos categories salvos

    console.log({ userId: req.userId }); // posso acessar em qq lugar da aplicação atraves do req

    return res.status(200).json(categories);
  }
}

export default new CategoryController();
