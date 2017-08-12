var mongoose = require('../libs/mongoose.js');
var ObjectID = require('mongodb').ObjectID;
exports.get = function(req, res) {
  mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.params.id)}, function(err, doc) {
    if (err) {
      throw err;
    } else {
      return res.render('guest', {user: doc});
    }
  });
};
