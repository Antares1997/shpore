
var mongoose = require('../libs/mongoose.js');
exports.get = function(req, res) {
  if (req.session.user !== undefined) {
    mongoose.connection.db.collection('routes').find().toArray(function(err, routes) {
      if (err) throw err;
      res.render('personal_room', {routes: routes});
    });
  } else {
    return res.render('error');
  }
};
