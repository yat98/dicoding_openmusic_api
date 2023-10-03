import { PlaylistPayloadSchema, SongInPlaylistPayloadSchema } from './schema.js';
import schema from '../schema.js';
import failAction from '../../actions/fail.js';

const postPlaylistValidation = {
  options: schema.option,
  payload: PlaylistPayloadSchema,
  failAction,
};

const postSongInPlaylistValidation = {
  options: schema.option,
  payload: SongInPlaylistPayloadSchema,
  failAction,
};

const deleteSongInPlaylistValidation = {
  options: schema.option,
  payload: SongInPlaylistPayloadSchema,
  failAction,
};

export default {
  postPlaylistValidation,
  postSongInPlaylistValidation,
  deleteSongInPlaylistValidation,
};
