const BadRequestError = require('./bad-request-error');
const UnathorizedError = require('./unathorized-error');
const ForbidenError = require('./forbidden-error');
const NotFoundError = require('./not-found-error');
const InternalServerError = require('./internal-server-error');

module.exports = {
  BadRequestError,
  UnathorizedError,
  ForbidenError,
  NotFoundError,
  InternalServerError,
}