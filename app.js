
var express = require('express');
var path = require('path');
// var mongoose = require('mongoose');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/index.js');
var index = require('./routes/index');
const formidable = require('express-formidable');
// var users = require('./routes/users');
var app = express();
// var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);
// var log = require('./libs/log')(module);
// view engine setup
// mongoose.connect('mongodb://SergiyKorotun:KorotunSergiy1997@ds115752.mlab.com:15752/users', function(err) {
//   if (err) {
//     return console.log(err);s
//   }
// });

require('./routes')(app);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', config.get('port'));
app.engine('ejs', require('ejs-locals'));
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(formidable());

// if (app.get('env') === 'production') {
//   app.set('trust proxy', 1); // trust first proxy
//   sess.cookie.secure = true; // serve secure cookies
// }

app.use('/', index);
// app.use(favicon(path.join(__dirname, 'public')));
app.use(logger('dev'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.listen(app.get('port'), function() {
  // log.info('hi');
  console.log('Express server listening on port ' + config.get('port'));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
