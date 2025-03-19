import * as Yup from 'yup';
import User from '../models/User';
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'

class SessionController {
  async store(req, res) {
    //criando o schema de session
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    const emailOrPasswordIncorrect = () => {
      res.status(401).json({ message: 'make sure your email or password is correct' });
    };

    // validando o schema
    const isValid = await schema.isValid(req.body);

    if (!isValid) {
      return emailOrPasswordIncorrect();
    }

    //recuperando os dados para validar o usuário e a senha

    const { email, password } = req.body;

    // validando usuário
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return emailOrPasswordIncorrect();
    }

    // verificando se a senha é correta
    const isSamePassword = await user.checkPassword(password); // método checkpassword importado de user.js

    if (!isSamePassword) {
      return emailOrPasswordIncorrect();
    }

    
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email,
      admin: user.admin,
      token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, { expiresIn: authConfig.expiresIn}) //assinando o token - payload(id do usuário, autoconfig é a chave do token, expiresIn - quando expira o token)
    });
  }
}

export default new SessionController();
