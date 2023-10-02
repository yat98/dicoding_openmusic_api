import Joi from 'joi';

const UserPayloadSchema = Joi.object({
  fullname: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export default UserPayloadSchema;
