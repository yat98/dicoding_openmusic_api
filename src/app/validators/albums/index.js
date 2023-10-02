import AlbumPayloadSchema from './schema.js';
import schema from '../schema.js';
import failAction from '../../actions/fail.js';

const postAlbumValidation = {
  options: schema.option,
  payload: AlbumPayloadSchema,
  failAction,
};

const putAlbumValidation = {
  options: schema.option,
  payload: AlbumPayloadSchema,
  failAction,
};

export default {
  postAlbumValidation,
  putAlbumValidation,
};
