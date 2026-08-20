// Defines a custom Error class with an HTTP status code and a descriptive message

class ExpressError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
module.exports = ExpressError;