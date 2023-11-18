import { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import HttpStatusCode from '../utils/constants';
import { CustomRequest } from '../utils/type';

const CustomError = require('../errors/CustomError');

const updateUserMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
  handleUpdate: boolean,
) => {
  const { name, about, avatar } = req.body;
  const id = req.user?._id;
  try {
    const user = await User.findByIdAndUpdate(id, handleUpdate === true ? {
      name,
      about,
    } : {
      avatar,
    }, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw CustomError.NotFoundError('Пользователь не найден');
    }
    return res.status(HttpStatusCode.CREATED).json({ data: user });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(CustomError.BadRequest('Некорректный формат ID пользователя'));
    }
    return next(error);
  }
};

export default updateUserMiddleware;
