
var mongoose = require('../libs/mongoose.js');
var ObjectID = require('mongodb').ObjectID;
exports.get = function(req, res) {
  if (req.session.user !== undefined) {
    mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, doc) {
      if (err) throw err;
      if (doc.username === 'admin') {
        mongoose.connection.db.collection('books').find().toArray(function(err, books) {
          if (err) {
            throw err;
          } else {
            res.render('books', {books: books});
          }
        });
      } else {
        res.render('error');
      }
    });
  } else {
    return res.render('error');
  }
};
