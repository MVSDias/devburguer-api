import * as Yup from 'yup';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';

class ProductController {
   /*  ** criando os produtos ** */
  async store(req, res) {
    // criando o schema

    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean() // não é obrigatorio
    });

    // validando o  schema

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    // verificando se o usuário é admin

    const { admin: isAdmin } = await User.findByPk(req.userId)
    // estou desestruturando o req e pegando apenas a propriedade admin e renomeando pra "isAdmin" por semântica pro código. procuro em User pela primaryKey enviada pelo token(req.userId)

    if(!isAdmin) { // se não for admin...
      return res.status(401).json()
    }

    // recuperando as informações de file

    const { filename: path } = req.file // qnd estou desestruturando (entre chaves), qnd coloco ':' significa q estou renomeando filename pra path

    const { name, price, category_id, offer } = req.body

    // criando o produto - salvando produto no banco

    const product = await Product.create({
        name,
        price,
        category_id,
        path,
        offer
    })

    return res.status(201).json(product);
  }

  /*  ** atualizando os produtos ** */
  async update(req, res) {
    // criando o schema

    const schema = Yup.object({
      name: Yup.string(), //não sei qual irá atualizar por isso sem required
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean() 
    });

    // validando o  schema

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    // verificando se o usuário é admin

    const { admin: isAdmin } = await User.findByPk(req.userId)
    // estou desestruturando o req e pegando apenas a propriedade admin e renomeando pra "isAdmin" por semântica pro código. procuro em User pela primaryKey enviada pelo token(req.userId)

    if(!isAdmin) { // se não for admin...
      return res.status(401).json()
    }

    // recuperando as informações de file

    const { id } = req.params

    // verificando se existe o produto no banco pelo id passado
    const findProduct = await Product.findByPk(id)// vou na tabela de products e procuro pela primaryKey e comparo com o id enviado

    if(!findProduct){ // se não existir o produto
      return res.status(400).json({ error: 'Make sure your product ID is correct'})
    }

    // se não for preciso atualizar a imagem o req.file.filename é opcional. Tornando opcional
    let path;
    if(req.file){
      path = req.file.file
    }

    // esse trecho de código substitue a obiagtoriedade desse trecho aqui ;(const { filename: path } = req.file // qnd estou desestruturando (entre chaves), qnd coloco ':' significa q estou renomeando filename pra path)

    const { name, price, category_id, offer } = req.body

    // atualizando o produto e salvando no banco

    await Product.update({
        name,
        price,
        category_id,
        path,
        offer
    },
    {
      where: { // aonde vou atualizar...no produto q tem esse id
        id
    }
 
  })

    return res.status(201).json(); // não preciso retornar nenhuma mensagem
  }

  /*  ** listando todas os produtos ** */

  async index(req, res) { // método de indexação
    const products = await Product.findAll({
      include: [ // incluindo as informações
        {
          model: Category, // importo a model de Category
          as: 'category', // salvo como a propriedade 'category'
          attributes: [ 'id', 'name'] // e esses são apenas esses campos q quero trazer. Se fosse p trazer todos não precisava explicitar.
        }
      ]
    }) // vou no banco, na tabela de roducts e busco todos products salvos

    console.log({userId: req.userId}) // posso acessar em qq lugar da aplicação atraves do req

    return res.status(200).json(products)
  }
}

export default new ProductController();
