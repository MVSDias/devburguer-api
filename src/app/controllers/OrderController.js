import * as Yup from 'yup';
import Order from '../schemas/Order';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';


class OrderController {
   /*  ** criando as orders ** */
  async store(req, res) {
    // criando o schema de order(pedido)

    const schema = Yup.object({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          }),
        ),
    });

    // validando o  schema

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    //recuperando os produtos do body da requisição
    const { products } = req.body;

    //buscando os id's dos produtos na requisição
    const productsId = products.map((product) => product.id); // para cada produto do array de produtos da requisição, pego o id e retorno p prductsId criando um novo array de ids dos produtos da requisição

    //buscando dados dos produtos pelos ids de array de ids criado a partir da requisição
    const findProducts = await Product.findAll({
      //procuro na tabela de produtos do banco
      where: {
        id: productsId, // procuro pelos id's do array de id's
      },
      include: [
        // e incluo...
        {
          model: Category, //...da model Category...
          as: 'category', //...salvo na prorpiedade 'category'
          attributes: ['name'], //...apenas o atributo 'name'
        },
      ],
    });

    // formatando a informação que retorna da requisição
    const formattedProducts = findProducts.map((product) => {
      // faço um map no array de products criado a partir do array de ids da req.

      const productIndex = products.findIndex((item) => item.id === product.id); // findIndex -> quero achar o index do array de products enviado na req e comparar com o id do produto encontrado a partir do array de ids

      const newProduct = {
        id: product.id,
        name: product.name,
        category: product.category.name,
        price: product.price,
        url: product.url,
        quantity: products[productIndex].quantity,
      };

      return newProduct;
    });

    // criando o pedido

    const order = {
      user: {
        id: req.userId,
        name: req.userName,
      },
      products: formattedProducts,
      status: 'Pedido Realizado',
    };

    // salvando a order no banco

    const createdOrder = await Order.create(order)

    return res.status(201).json(createdOrder);
  }

  /*  ** listando todas as orders ** */

  async index(req, res) {
    const orders = await Order.find() //não uso o findAll pq não passo nenhum parâmetro como o where por exemplo

    return res.json(orders)
  }

   /*  ** atualizando tod0s as orders ** */
  async update(req, res) {
    // criando o schema de update
    const schema = Yup.object({
      status: Yup.string().required()
    })

    //validando o schema - vendo se é uma string
    try {
      schema.validateSync(req.body, { abortEarly: false})
    } catch(err) {
      return res.status(400).json({ error: err.message})
    }

    // verificando se o usuário é admin

    const { admin: isAdmin } = await User.findByPk(req.userId)
    // estou desestruturando o req e pegando apenas a propriedade admin e renomeando pra "isAdmin" por semântica pro código. procuro em User pela primaryKey enviada pelo token(req.userId)

    if(!isAdmin) { // se não for admin...
      return res.status(401).json()
    }

    // recuperando o id e o status da requisição

    const { id } = req.params
    const { status } = req.body

    //verificando se order existe pelo id passado  e validando o id

    try{
      await Order.updateOne({ _id: id }, { status }) // atualizo apenas um. dizeno onde vou procurar (_id: id - id do mongo vem com underline),  e digo quem atualizar (status)
    } catch(err){
      return res.status(400).json({ error: err.message })
    }
    return res.json({ message: 'Status updated sucessfully'})
  }
}

export default new OrderController();
