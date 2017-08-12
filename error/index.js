// var path = require('path');
var util = require('util');
var http = require('http');

function AuthError(message) {
  Error.apply(this, arguments);
  Error.captueStackTrace(this, AuthError);
  this.status = status;
  this.message = message || http.STATUS_CODES[status] || 'Error';
};

util.inherits(AuthError, Error);
AuthError.prototype.name = 'AuthError';
exports.AuthError = AuthError;
