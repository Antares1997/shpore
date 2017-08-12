
exports.get = function(req, res) {
  if (req.session.user !== undefined) {
    res.render('contact');
  } else {
    return res.render('error');
  }
};
