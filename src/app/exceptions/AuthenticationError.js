import ClientError from './ClientError.js';

/* c8 ignore next 2 */
class AuthenticationError extends ClientError {
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export default AuthenticationError;
