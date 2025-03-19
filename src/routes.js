import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import multer from 'multer'
import multerConfig from './config/multer'
import authMiddleware from './app/middlewares/auth';
import CategoryController from './app/controllers/CategoryController';
import OrderController from './app/controllers/OrderController';
import CreatePaymentIntentController from './app/controllers/STRIPE/CreatePaymentIntentController'

const routes = new Router();
const upload = multer(multerConfig)

routes.post('/users', UserController.store); // cria usuário
// UserControllerpor te sido instanciado já tenho acesso ao método store

routes.post('/sessions', SessionController.store)



routes.use(authMiddleware) // todas as rotas abaixo deverão ser autenticadas pelo token

routes.get('/products', ProductController.index)
routes.post('/products', upload.single('file'), ProductController.store)
// upload.single('file') - significa q só posso fazer upload de 1 arquivo por vez, e no campo 'file' do cliente frontend(httpie, insomnia, frontend da aplicação, etc...)
routes.put('/products/:id', upload.single('file'), ProductController.update)

routes.get('/categories', CategoryController.index)
routes.post('/categories', upload.single('file'), CategoryController.store)
routes.put('/categories/:id', upload.single('file'), CategoryController.update)

routes.post('/orders', OrderController.store)
routes.get('/orders', OrderController.index)
routes.put('/orders/:id', OrderController.update)

routes.post('/create-payment-intent', CreatePaymentIntentController.store)

export default routes;
