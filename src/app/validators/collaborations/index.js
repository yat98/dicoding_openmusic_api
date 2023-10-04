import CollaborationPayloadSchema from './schema.js';
import schema from '../schema.js';
import failAction from '../../actions/fail.js';

const postCollaborationValidation = {
  options: schema.option,
  payload: CollaborationPayloadSchema,
  failAction,
};

const deleteCollaborationValidation = {
  options: schema.option,
  payload: CollaborationPayloadSchema,
  failAction,
};

export default {
  postCollaborationValidation,
  deleteCollaborationValidation,
};
