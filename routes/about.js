
var mongoose = require('../libs/mongoose.js');
var ObjectID = require('mongodb').ObjectID;

exports.get = function(req, res) {
  if (req.session.user !== undefined) {
    var url = require('url').parse(req.url);
    url = url.pathname.split('/')[1];
    url = url.charAt(0).toUpperCase() + url.substr(1);
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
            var section;
            if (url === 'About') {
              mongoose.connection.db.collection('routes').find().toArray(function(err, routes) {
                if (err) throw err;
                return res.render('about', {books: docs, money: money, routes: routes});
              });
            } else {
              bookmas = [];
              books.map(function(x) {
                section = x.name.split('_')[0];
                if (section === url) {
                  bookmas.push(x);
                }
              });
              mongoose.connection.db.collection('routes').find().toArray(function(err, routes) {
                if (err) throw err;
                return res.render('about', {books: bookmas, money: money, routes: routes});
              });
            }
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
            throw err;
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
