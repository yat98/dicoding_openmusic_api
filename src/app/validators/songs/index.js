import SongPayloadSchema from './schema.js';
import schema from '../schema.js';
import failAction from '../../actions/fail.js';

const addSongValidation = {
  options: schema.option,
  payload: SongPayloadSchema,
  failAction,
};

const updateSongValidation = {
  options: schema.option,
  payload: SongPayloadSchema,
  failAction,
};

export default {
  addSongValidation,
  updateSongValidation,
};
