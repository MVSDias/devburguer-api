
import express from 'express';
import routes from './routes';
import './database'; // importo assim apenas para instanciar(iniciar) a conexão ao iniciar a aplicação. Não usarei ele aqui.
import { resolve } from 'node:path';
import cors from 'cors';

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.app.use(cors('http://localhost:5173'));
    this.routes();
    
  }

  middlewares() {
    this.app.use(express.json());

    this.app.use('/product-file', express.static(resolve(__dirname, '..', 'uploads'))); //toda vez q bater na rota /product-file, o express vai 'servir' os arquivos da pasta uploads pelo path

    this.app.use('/category-file', express.static(resolve(__dirname, '..', 'uploads'))); //toda vez q bater na rota /category-file, o express vai 'servir' os arquivos da pasta uploads pelo path (mostrar as imagens)
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().app;
