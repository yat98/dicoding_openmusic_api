import ClientError from './ClientError.js';

/* c8 ignore next 2 */
class ValidationError extends ClientError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export default ValidationError;
