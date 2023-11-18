import {
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import cardRouter from './cards';
import userRouter from './users';

const CustomError = require('../errors/CustomError');

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req: Request, res: Response, next: NextFunction) => {
  next(CustomError.NotFoundError('Страница не найдена'));
});

export default router;
