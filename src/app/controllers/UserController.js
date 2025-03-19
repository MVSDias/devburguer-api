/**
  
O controller faz o meio de campo entre view e model. Recebe as requisições, chama a model, faz as ligações e etc.

   Padrões de métodos de controller:

    * store  -> cadastrar/adiconar
    * index  -> listar vários
    * show   -> listar apenas 1
    * update -> atualizar
    * delete -> deletar
  
 */

import User from '../models/User';
import { v4 } from 'uuid';
import * as Yup from 'yup'; 
// importo tudo (*) que existe dentro do yup como Yup

class UserController {
  async store(req, res) {
    

    // criando o schema

    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
      admin: Yup.boolean(),
    });

    // validando o schema

    try {
      schema.validateSync(req.body, { abortEarly: false }); 
      // abortEarly como false evita q a verificação pare no primeiro erro
    } catch (err) {
      return res.status(400).json({ error: err.errors }); 
      // early return - se tiver um erro retorna antes de continuar o resto do codigo. error: err.errors -> retorna o erro completo para o usuário
    }

    const { name, email, password, admin } = req.body;

    const userExists = await User.findOne({ // procuro no banco, em emails, se já existe 
        where: {
            email
        }
    })

    if(userExists) { // se existe retorno o erro
        return res.status(409).json({ error: 'User already exisits'})
    }
    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      admin,
    });

    return res.status(201).json({
      id: user.id, // recupero do user.id
      name, // recupero do req.body
      email, // recupero do req.body
    });
  }
}

export default new UserController();
