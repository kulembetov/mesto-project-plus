import { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import HttpStatusCode from '../utils/constants';
import { CustomRequest } from '../utils/type';

const CustomError = require('../errors/CustomError');

const updateLikeCardMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
  handleUpdate: boolean,
) => {
  const { cardId } = req.params;
  const id = req.user?._id;
  try {
    if (!cardId) {
      throw CustomError.BadRequest('Карточка с указанным ID не найдена');
    }

    const card = await Card.findByIdAndUpdate(cardId, handleUpdate === true ? {
      $addToSet: {
        likes: id,
      },
    } : {
      $pull: {
        likes: id,
      },
    }, {
      new: true,
      runValidators: true,
    });
    if (!card) {
      throw CustomError.NotFoundError('Карточка не найдена');
    }
    return res.status(HttpStatusCode.CREATED).json({ data: card });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(CustomError.BadRequest('Некорректный формат ID карточки'));
    }
    return next(error);
  }
};

export default updateLikeCardMiddleware;
