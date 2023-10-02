import ClientError from './ClientError.js';

/* c8 ignore next 2 */
class AuthorizationError extends ClientError {
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export default AuthorizationError;
