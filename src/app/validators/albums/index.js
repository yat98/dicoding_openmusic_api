import AlbumPayloadSchema from './schema.js';
import schema from '../schema.js';
import failAction from '../../actions/fail.js';

const addAlbumValidation = {
  options: schema.option,
  payload: AlbumPayloadSchema,
  failAction,
};

const updateAlbumValidation = {
  options: schema.option,
  payload: AlbumPayloadSchema,
  failAction,
};

export default {
  addAlbumValidation,
  updateAlbumValidation,
};
