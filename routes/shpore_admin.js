
var mongoose = require('../libs/mongoose.js');
// var ObjectID = require('mongodb').ObjectID;
exports.get = function(req, res) {
  mongoose.connection.db.collection('routes').find().toArray(function(err, routes) {
    if (err) throw err;
    res.render('shpore_admin', {routes: routes});
  });
};
