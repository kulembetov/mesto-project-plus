import {
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import Errors from '../errors/errors';
import cardRouter from './cards';
import userRouter from './users';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req: Request, res: Response, next: NextFunction) => {
  next(Errors.notFoundError('Страница не найдена'));
});

export default router;