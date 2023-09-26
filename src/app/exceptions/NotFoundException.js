/* c8 ignore next 2 */
class NotFoundError extends Error {
  constructor(message, statusCode = 404) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default NotFoundError;