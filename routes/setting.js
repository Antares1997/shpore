
var User = require('../models/users.js').User;
var mongoose = require('../libs/mongoose.js');
var AuthError = require('../models/users.js').AuthError;

exports.get = function(req, res) {
  if (req.session.user !== undefined) {
    mongoose.connection.db.collection('routes').find().toArray(function(err, routes) {
      if (err) throw err;
      res.render('setting', {status: '', routes: routes});
    });

  } else {
    res.render('error');
  }
};

exports.post = function(req, res, next) {
  var oldpass = req.body.oldpassword;
  var newpass = req.body.newpassword;
  var newpass2 = req.body.newpassword2;
  if (newpass !== newpass2) {
    mongoose.connection.db.collection('routes').find().toArray(function(err, routes) {
      if (err) throw err;
      return res.render('setting', {status: 'notEqual', routes: routes});
    });
  } else if (oldpass !== newpass) {
    User.recuperation(req.session.user, oldpass, newpass, function(err, user) {
      if (err) {
        if (err instanceof AuthError) {
          return res.send(403, err.message);
        } else {
          return next(err);
        }
      }

      mongoose.connection.db.collection('routes').find().toArray(function(err, routes) {
        if (err) throw err;
        res.render('setting', {status: 'ok', routes: routes});
      });
    });
  };
  // else {
  //   mongoose.connection.db.collection('routes').find().toArray(function(err, routes) {
  //     if (err) throw err;
  //     res.render('setting', {status: 'bad', routes: routes});
  //   });
  // }


};
