var User = require('../models/users.js').User;

module.exports = function(req, res, next) {
  if (!req.session.user) {
    return next();
  } else {
    User.findOne({_id: req.session.user}, function(err, user) {
      if (err) {
        return next(err);
      } else {
        req.user = user;
        next();
      }
    });
  }
};
