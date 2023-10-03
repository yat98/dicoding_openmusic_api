import Joi from 'joi';

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const SongInPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

export {
  PlaylistPayloadSchema,
  SongInPlaylistPayloadSchema,
};
