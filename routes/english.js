
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
              if (mathbook === 'Англiйська') {
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


exports.post = function(req, res, next) {
  var dbmoney;
  mongoose.connection.db.collection('money').findOne({_id: ObjectID(req.session.user)}, function(err, doc) {
    var NumberOfDowndload = doc.NumberOfDowndload;
    if (err) {
      console.log(err);
    } else {
      if (doc.money < 19) {
        res.send({status: 'bad'});
      } else {
        dbmoney = doc.money - 30;
        // doc.
        mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, user) {
          if (err) {
            throw err
          } else {
            if (user.username === 'admin') {
              mongoose.connection.db.collection('money').updateOne(
                {_id: ObjectID(doc._id)},
                {
                  _id: ObjectID(doc._id),
                  money: 10000000000,
                  name: user.username,
                  NumberOfDowndload: 10000000000
                },
                function(res) {
                }
              );
            } else {
              mongoose.connection.db.collection('money').updateOne(
                {_id: ObjectID(doc._id)},
                {
                  _id: ObjectID(doc._id),
                  money: dbmoney,
                  name: user.username,
                  NumberOfDowndload: NumberOfDowndload
                },
                function(res) {
                }
              );
            }
          }
        });
        res.send({money: dbmoney});
      }
    }
  });


};
