import {
  Document,
  Schema,
  Types,
  model,
} from 'mongoose';
import validation from '../utils/validators';
import user from './user';

interface ICard extends Document {
  name: string,
  link: string,
  owner: Schema.Types.ObjectId,
  likes: Array<Types.ObjectId>,
  createdAt: Date
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: validation.linkValidationUser,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: user,
    required: true,
  },
  likes: {
    type: [Types.ObjectId],
    default: [],
    ref: user,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>('card', cardSchema);
