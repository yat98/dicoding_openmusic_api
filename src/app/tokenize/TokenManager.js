import Jwt from '@hapi/jwt';
import token from '../../config/token.js';
import ValidationError from '../exceptions/ValidationError.js';

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, token.accessTokenKey),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, token.refreshTokenKey),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, token.refreshTokenKey);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new ValidationError('token is invalid');
    }
  },
};

export default TokenManager;
