import jwt from "jsonwebtoken";
import authCconfig from '../../config/auth'

function authMiddleware(req, res, next) {
  const authToken = req.headers.authorization;

  // validando se o token existe

  if(!authToken){
    return res.status(401).json({ error: 'Token not provided'})
  }

  // validando se o token está certo e se ainda não expirou

  const token = authToken.split(' ').at(1) // separo o conteudo do token usando espaço como parâmetro e pego a sring da segunda posição(at(1)) e salvo na contante token

  try{
    jwt.verify(token, authCconfig.secret, (err, decoded) =>{ // uso o método verify do jwt para comparar o token passado com o token da aplicação. pode ocorrer um erro ou decodificar o payload e armazenar no decoded
        if(err) { // se der erro
            throw new Error() // estoura uma exceçao e vai direto pro catch
        }

        req.userId = decoded.id // crio uma propriedade (req.userId) e guardo nela o id do usuário extraído do decoded.id. Posso acessá-la em qq lugar pq o middleware me permite isso
        req.userName = decoded.name // o mesmo aqui

        console.log(decoded)
    })
  // eslint-disable-next-line no-unused-vars
  } catch(err) {
    return res.status(401).json({ error: 'Token is not valid'})
  }

  return next();
}

export default authMiddleware;
