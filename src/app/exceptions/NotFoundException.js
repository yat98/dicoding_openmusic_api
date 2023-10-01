import ClientError from './ClientError.js';

/* c8 ignore next 2 */
class NotFoundError extends ClientError {
  constructor(message, statusCode = 404) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;
