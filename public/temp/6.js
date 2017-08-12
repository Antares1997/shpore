
var mongoose = require('../libs/mongoose.js');
var ObjectID = require('mongodb').ObjectID;
// var AuthError = require('../models/users.js').AuthError;
exports.get = function(req, res) {
  if (req.params.id.length !== req.session.user.length) {
    return res.render('error');
  } else if (req.params.id !== req.session.user) {
    mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.params.id)}, function(err, doc) {
      if (err || !doc) {
        return res.render('error');
      } else {
        if (doc.username === 'admin') {
          return res.render('error');
        } else {
          return res.redirect('../guest/' + req.params.id);
        }
      }
    });
  } else {
    mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, doc) {
      if (err) {
        throw err;
      }
      if (doc.username === 'admin') {
        res.redirect('/shpore_admin/' + req.session.user);
      } else {
        mongoose.connection.db.collection('books').find().toArray(function(err, docs) {
          if (err) {
            throw err;
          } else {
            mongoose.connection.db.collection('money').findOne({_id: ObjectID(req.session.user)}, function(err, doc) {
              if (err) {
                res.send('U havent money!');
              } else {
                var books = docs;
                var money = doc.money;
                return res.render('shpore', {books: books, money: money, user: req.user});
              }
            });
          }
        });
      }
    });

  }
};
