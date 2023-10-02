import schema from '../schema.js';
import { AuthenticationPayloadSchema, UpdateAuthenticationPayloadSchema } from './schema.js';
import failAction from '../../actions/fail.js';

const postAuthenticationValidation = {
  options: schema.option,
  payload: AuthenticationPayloadSchema,
  failAction,
};

const putAuthenticationValidation = {
  options: schema.option,
  payload: UpdateAuthenticationPayloadSchema,
  failAction,
};

const deleteAuthenticationValidation = {
  options: schema.option,
  payload: UpdateAuthenticationPayloadSchema,
  failAction,
};

export default {
  postAuthenticationValidation,
  putAuthenticationValidation,
  deleteAuthenticationValidation,
};
