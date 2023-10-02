import SongPayloadSchema from './schema.js';
import schema from '../schema.js';
import failAction from '../../actions/fail.js';

const postSongValidation = {
  options: schema.option,
  payload: SongPayloadSchema,
  failAction,
};

const putSongValidation = {
  options: schema.option,
  payload: SongPayloadSchema,
  failAction,
};

export default {
  postSongValidation,
  putSongValidation,
};
