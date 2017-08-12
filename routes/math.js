
var mongoose = require('../libs/mongoose.js');
var ObjectID = require('mongodb').ObjectID;

exports.get = function(req, res) {
  if (req.session.user !== undefined) {
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
            var bookmas = [];
            var mathbook;
            books.map(function(x) {
              mathbook = x.name.split('_')[0];
              if (mathbook === 'Математика') {
                bookmas.push(x);
              }
            });
            return res.render('about', {books: bookmas, money: money});
          }
        });

      }
    });
  } else {
    return res.render('error');
  }
};
