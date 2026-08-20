// Wraps asynchronous route handler functions to catch and pass errors to the next middleware

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  }
};