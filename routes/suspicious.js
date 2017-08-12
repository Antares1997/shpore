
var mongoose = require('../libs/mongoose.js');
var ObjectID = require('mongodb').ObjectID;
exports.get = function(req, res) {
  if (req.session.user !== undefined) {
    mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, doc) {
      if (err) throw err;
      if (doc.username === 'admin') {
        mongoose.connection.db.collection('suspicious').find().toArray(function(err, docs) {
          if (err) {
            res.send('Ошибка в базе данных suspicious!');
          } else {
            // res.render('suspicious', {user: docs.uploader});
            docs.shift();
            res.send(docs);
          }
        });
      } else {
        // return res.redirect('../error');
        res.render('error');
      }
    });
  } else {
    res.render('error');
  }
};
