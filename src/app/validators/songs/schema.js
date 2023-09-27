import Joi from 'joi';

const currentYear = new Date().getFullYear();

const SongPayloadSchema = Joi.object({
  albumId: Joi.string().optional(),
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(currentYear)
    .required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().optional(),
});

export default SongPayloadSchema;
