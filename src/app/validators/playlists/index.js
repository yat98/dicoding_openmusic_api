import PlaylistPayloadSchema from './schema.js';
import schema from '../schema.js';
import failAction from '../../actions/fail.js';

const postPlaylistValidation = {
  options: schema.option,
  payload: PlaylistPayloadSchema,
  failAction,
};

export default {
  postPlaylistValidation,
};
