
exports.get = function(req, res) {
  if (req.session.user !== undefined) {
    res.render('personal_room');
  } else {
    return res.render('error');
  }
};
