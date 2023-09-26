import Joi from 'joi';

const SongPayloadSchema = Joi.object({
  albumId: Joi.string().optional(),
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().optional(),
});

export default SongPayloadSchema;
