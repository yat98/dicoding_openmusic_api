import UserPayloadSchema from './schema.js';
import schema from '../schema.js';
import failAction from '../../actions/fail.js';

const postUserValidation = {
  options: schema.option,
  payload: UserPayloadSchema,
  failAction,
};

export default {
  postUserValidation,
};
