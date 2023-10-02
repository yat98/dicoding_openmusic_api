import Joi from 'joi';

const AuthenticationPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const UpdateAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export {
  AuthenticationPayloadSchema,
  UpdateAuthenticationPayloadSchema,
};
