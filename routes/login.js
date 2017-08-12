
// var async = require('async');
// var config = require('../config');
var User = require('../models/users.js').User;
var AuthError = require('../models/users.js').AuthError;
// var AuthError = require('./models/user.js');
// var nodemailer = require('nodemailer');
// var sendmail = require('../libs/sendMail.js');
var mongoose = require('../libs/mongoose.js');
var ObjectID = require('mongodb').ObjectID;

exports.get = function(req, res) {
  req.session.user = undefined;
  res.render('login', {title: 'Express'});

};
exports.post = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  User.authhorize(username, password, function(err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return res.send(403, err.message);
      } else {
        return next(err);
      }
    }
    req.session.user = user._id;

    mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, doc) {
      var money = {
        _id: ObjectID(doc._id),
        money: 100,
        name: doc.username,
        NumberOfDowndload: 5
      };
      if (err) throw err;
      if (username === 'admin') {
        res.redirect('/shpore_admin/' + req.session.user);
        var moneyadmin = {
          _id: ObjectID(doc._id),
          money: 100000000000,
          name: doc.username,
          NumberOfDowndload: 10000000000000
        };
        mongoose.connection.db.collection('money').insert(moneyadmin);
      } else {
        mongoose.connection.db.collection('money').insert(money);
        res.redirect('/shpore/' + req.session.user);
      }
    });
  });
};


//   async.waterfall([
//     function(callback) {
//       User.findOne({username: username}, callback);
//     },
//     function(user, callback) {
//       // console.log('Session---', req.session);
//       if (user) {
//         if (user.checkPassword(password)) {
//           callback(null, user);
//         } else {
//           res.send(403, 'Пароль невiрний або iснуе аккаунт з таким же логiном!');
//         }
//       } else {
//         user = new User({username: username, password: password});
//         user.save(function(err) {
//           if (err) {
//             return next(err);
//           } callback(null, user);
//         });
//       }
//     }
//   ], function(err, user) {
//     if (err) return next(err);
//     req.session.user = user._id;
//     // create reusable transporter object using the default SMTP transport
//     // let transporter = nodemailer.createTransport({
//     //   host: '127.0.0.1',
//     //   port: config.get('port'),
//     //   secure: true, // secure:true for port 465, secure:false for port 587
//     //   auth: {
//     //     user: 'Сергій Коротун',
//     //     pass: 'KorotunSergiy1997'
//     //   }
//     // });
//     // // setup email data with unicode symbols
//     // let mailOptions = {
//     //   from: 'KorotunSergiy1997@gmail.com', // sender address
//     //   to: 'mytestmail1997@gmail.com', // list of receivers
//     //   subject: 'Hello world', // Subject line
//     //   text: 'Hello world?', // plain text body
//     //   html: '<b>Hello world ?</b>' // html body
//     // };
//     // // send mail with defined transport object
//     // transporter.sendMail(mailOptions, (error, info) => {
//     //   if (error) {
//     //     return console.log(error);
//     //   }
//     //   console.log('Message %s sent: %s', info.messageId, info.response);
//     // });
//     // console.log(req.session);
//     res.send('Hello ' + user.username + ', ');
//   });
// };
