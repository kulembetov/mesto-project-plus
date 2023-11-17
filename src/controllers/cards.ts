import { NextFunction, Request, Response } from 'express';
import Errors from '../errors/errors';
import Card from '../models/card';
import { CustomRequest } from '../utils/type';

const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send({ data: cards });
  } catch (error) {
    console.error(error);
    return next(Errors.internalError('На сервере произошла ошибка'));
  }
};

const createCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  if (!name || !link || !owner) {
    return next(Errors.badRequestError('Запрашиваемый пользователь не найден'));
  }

  try {
    const card = await Card.create({ name, link, owner });
    return res.status(201).json({ data: card });
  } catch (error) {
    console.error(error);
    return next(Errors.internalError('На сервере произошла ошибка'));
  }
};

const removeCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      return next(Errors.authorizationError('Вы не можете удалить карточку другого пользователя'));
    }
    return res.status(204).json({ data: card });
  } catch (error) {
    console.error(error);
    return next(Errors.internalError('На сервере произошла ошибка'));
  }
};

const likeCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const id = req.user?._id;

  if (!cardId) {
    return next(Errors.badRequestError('Запрашиваемый пользователь не найден'));
  }

  try {
    const card = await Card.findByIdAndUpdate(cardId, {
      $addToSet: {
        likes: id,
      },
    }, {
      new: true,
    });
    if (!card) {
      return next(Errors.notFoundError('Карточка не найдена'));
    }
    return res.status(201).json({ data: card });
  } catch (error) {
    console.error(error);
    return next(Errors.internalError('На сервере произошла ошибка'));
  }
};

const dislikeCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const id = req.user?._id;

  if (!cardId) {
    return next(Errors.badRequestError('Запрашиваемый пользователь не найден'));
  }

  try {
    const card = await Card.findByIdAndUpdate(cardId, {
      $pull: {
        likes: id,
      },
    }, {
      new: true,
    });
    if (!card) {
      return next(Errors.notFoundError('Карточка не найдена'));
    }
    return res.status(204).json({ data: card });
  } catch (error) {
    console.error(error);
    return next(Errors.internalError('На сервере произошла ошибка'));
  }
};

export default {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
};