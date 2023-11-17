import express, {
  Application,
  NextFunction,
  Response,
  json,
} from 'express';
import mongoose from 'mongoose';
import router from './routes/index';
import { CustomRequest } from './utils/type';

const { PORT = 3000 } = process.env;

const app: Application = express();

app.use(json());
app.use('/', router);

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '65571aac46340c493b3fa1e3',
  };

  next();
});

const connect = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
    console.log('Подключение к MongoDB успешно.');

    app.listen(PORT, () => {
      console.log(`Сервер использует '${PORT}' порт.`);
    });
  } catch (error) {
    console.error(error);
  }
};

connect();