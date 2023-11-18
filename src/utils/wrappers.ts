import { NextFunction, Response } from 'express';
import User from '../models/user';
import { CustomRequest } from './type';

const CustomError = require('../errors/CustomError');

// eslint-disable-next-line no-unused-vars
const searchUser = async (req: CustomRequest, res: Response, next: NextFunction, auth: boolean) => {
  const id = auth === true ? req.user?._id : req.params;
  const user = await User.findById(id);
  if (!user) {
    throw CustomError.NotFoundError('Запрашиваемый пользователь с указанным ID не найден');
  }
  return res.json({ data: user });
};

export default searchUser;
