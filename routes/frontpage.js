exports.get = function(req, res) {
  res.render('frontpage', {title: 'Express'});
  // console.log(req.session);
};
