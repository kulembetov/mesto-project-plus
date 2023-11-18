import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import updateLikeCardMiddleware from '../middlewares/likeUpdater';
import Card from '../models/card';
import HttpStatusCode from '../utils/constants';
import { CustomRequest } from '../utils/type';

const CustomError = require('../errors/CustomError');

const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.send({ data: cards });
  } catch (error) {
    return next(error);
  }
};

const createCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;
    const card = await Card.create({ name, link, owner });
    return res.status(HttpStatusCode.CREATED).json({ data: card });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(CustomError.BadRequest('Некорректный формат данных'));
    }
    return next(error);
  }
};

const removeCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const cardToDelete = await Card.findById(cardId).orFail();
    if (cardToDelete.owner.toString() !== req.user?._id) {
      throw CustomError.Unauthorized('Вы не можете удалить карточку другого пользователя');
    }
    const deleteCard = await cardToDelete.deleteOne();
    return res.status(HttpStatusCode.NO_CONTENT).json({ data: deleteCard });
  } catch (error) {
    if (error instanceof mongoose.Error.DocumentNotFoundError) {
      return next(CustomError.BadRequest('Карточка другого пользователя'));
    }
    if (error instanceof mongoose.Error.CastError) {
      return next(CustomError.BadRequest('Неверный ID пользователя'));
    }
    return next(error);
  }
};

const likeCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  const handleLikeCard = true;
  updateLikeCardMiddleware(req, res, next, handleLikeCard);
};

const dislikeCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  const handleLikeCard = false;
  updateLikeCardMiddleware(req, res, next, handleLikeCard);
};

export default {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
};
