import schema from '../schema.js';
import failAction from '../../actions/fail.js';
import ExportPlaylistPayloadSchema from './schema.js';

const postExportPlaylistValidation = {
  options: schema.option,
  payload: ExportPlaylistPayloadSchema,
  failAction,
};

export default {
  postExportPlaylistValidation,
};
