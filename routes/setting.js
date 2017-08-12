
var User = require('../models/users.js').User;
// var AuthError = require('../models/users.js').AuthError;

exports.get = function(req, res) {
  if (req.session.user !== undefined) {
    res.render('setting');
  } else {
    res.render('error');
  }
};

exports.post = function(req, res, next) {
  var oldpass = req.body.oldpassword;
  var newpass = req.body.newpassword;
  // User.recuperation(req.session.user, oldpassword, newpassword, next);
  User.recuperation(req.session.user, oldpass, newpass, next);
  res.redirect('/shpore/' + req.session.user);
};
