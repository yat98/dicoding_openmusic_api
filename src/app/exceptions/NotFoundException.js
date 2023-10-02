import ClientError from './ClientError.js';

/* c8 ignore next 2 */
class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;
