import AlbumPayloadSchema from './schema.js';
import {schemaOption} from '../schema.js';
import failAction from '../../actions/fail.js';

const addAlbumValidation = {
  options: schemaOption,
  payload: AlbumPayloadSchema,
  failAction,
};

const updateAlbumValidation = {
  options: schemaOption,
  payload: AlbumPayloadSchema,
  failAction,
};

export default {
  addAlbumValidation,
  updateAlbumValidation,
};