import multer from 'multer';
import { extname, resolve } from 'node:path';
import { v4 } from 'uuid';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'uploads'), 
    // para onde vão os arquivos, onde serão salvos
    filename: (req, file, callback) => // qual vai ser o nome do arquivo
      callback(null, v4() + extname(file.originalname)),
    // uso o v4()+ o nome do arquivo para gerar um nome unico pro arquivo e não ter repetido
  }),
};
