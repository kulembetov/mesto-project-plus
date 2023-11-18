/* eslint-disable no-console */
import { errors } from 'celebrate';
import express, {
  Application,
  json,
} from 'express';
import mongoose from 'mongoose';
import { PORT, db, server } from './config';
import userControllers from './controllers/users';
import authMiddleware from './middlewares/auth';
import errorsMiddleware from './middlewares/errors';
import logger from './middlewares/logger';
import router from './routes/index';
import validation from './validation/user';

const app: Application = express();

app.use(json());
app.use(logger.requestLogger);
app.use('/signin', validation.loginUserValidation, userControllers.loginUser);
app.use('/signup', validation.createUserValidation, userControllers.createUser);
app.use(authMiddleware);
app.use('/', router);
app.use(logger.errorLogger);
app.use(errors());
app.use(errorsMiddleware);

const connect = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(`mongodb://${server}/${db}`);
    console.log('Подключение к MongoDB успешно.');

    app.listen(PORT, () => {
      console.log(`Сервер использует '${PORT}' порт.`);
    });
  } catch (error) {
    console.error(error);
  }
};

connect();
