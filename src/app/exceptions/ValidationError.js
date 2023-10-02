import ClientError from './ClientError.js';

/* c8 ignore next 2 */
class ValidationError extends ClientError {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ValidationError';
  }
}

export default ValidationError;
