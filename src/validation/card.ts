import { Joi, Segments, celebrate } from 'celebrate';
import { urlRegExp } from '../config';

const createCardValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(urlRegExp).required(),
  }),
});

const getCardValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    cardId: Joi.string().length(24).hex().required,
  }),
});

export default { createCardValidation, getCardValidation };
