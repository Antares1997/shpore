
var fs = require('fs');
var multiparty = require('multiparty');
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
            mongoose.connection.db.collection('routes').find().toArray(function(err, routes) {
              if (err) throw err;
              res.render('books', {books: books, routes: routes});
              // res.send(books);
            });
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

exports.post = function(req, res) {
  var url = JSON.stringify(req.body).split(':')[0].split('"')[1];
  mongoose.connection.db.collection('books').remove({url: url});
  var test = './public' + url.slice(1);
  fs.unlink(test, function(err) {
    if (err) console.log(err);
    return res.send({status: 'ok', url: url});
  });

};
