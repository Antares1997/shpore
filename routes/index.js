var ObjectID = require('mongodb').ObjectID;
var mongoose = require('../libs/mongoose.js');
var config = require('../config/index.js');
var session = require('express-session');
// var app = require('../app');
var MongoStore = require('connect-mongo')(session);
module.exports = function(app) {
  var bodyParser = require('body-parser');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  var sess = {
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    name: 'Antares',
    store: new MongoStore({url: 'mongodb://SergiyKorotun:KorotunSergiy1997@ds115752.mlab.com:15752/users'}), // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: true
  };
  app.use(session(sess));

  app.get('/users', function(req, res, next) {
    if (req.session.user !== undefined) {
      mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, doc) {
        if (err) throw err;
        if (doc.username === 'admin') {
          mongoose.connection.db.collection('users').find().toArray(function(err, docs) {
            if (err) {
              res.sendStatus(500);
              return next(err);
            } else {
              // res.render('users_list', {users: docs});
              res.send(docs);
            }
          });
        } else {
          return res.render('error');
        }
      });
    } else {
      res.render('error');
    }
  });

  app.use(require('../middleware/loaduser.js'));
  app.get('/user/:id', function(req, res, next) {
    mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, doc) {
      if (err) throw err;
      if (doc.username === 'admin') {
        mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.params.id)}, function(err, user) {
          if (err) {
            return next(err);
          }
          if (!user) {
            res.sendStatus(404);
            // console.log(req.params.id);
          } else {
            res.send(user);
          }
        });
      } else {
        res.send('Нет доступа!');
      }
    });
  });
  app.get('/sessions', function(req, res, next) {
    mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, doc) {
      if (err) throw err;
      if (doc.username === 'admin') {
        mongoose.connection.db.collection('sessions').find().toArray(function(err, docs) {
          if (err) {
            next(err);
          }
          res.send(docs);
        });
      } else {
        res.send('Нет доступа!');
      }
    });
  });
  // app.get('/files', function(req, res, next) {
  //   mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, doc) {
  //     if (err) throw err;
  //     if (doc.username === 'admin') {
  //       res.render('');
  //     } else {
  //       res.send('Нет доступа!');
  //     }
  //   });
  // });

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
  };
  // app.get('/', require('./frontpage').get);
  app.get('/test', function(req, res, next) {
    // console.log('reg' + Object.getOwnPropertyNames(req));
    req.session.numberOfVisit = req.session.numberOfVisit + 1 || 1;
    res.send('Visits ' + req.session.numberOfVisit);
  });
  // delete
  app.delete('/delete', function(req, res) {
    mongoose.connection.db.collection('users').remove({});
    mongoose.connection.db.collection('routes').remove({});
    mongoose.connection.db.collection('sessions').remove({});
    mongoose.connection.db.collection('books').remove({});
    mongoose.connection.db.collection('money').remove({});
    mongoose.connection.db.collection('suspicious').remove({});
    res.sendStatus(200);
  });
  // app.get('/books', function(req, res) {
  //   if (req.session.user !== undefined) {
  //     mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, doc) {
  //       if (err) throw err;
  //       if (doc.username === 'admin') {
  //         mongoose.connection.db.collection('books').find().toArray(function(err, docs) {
  //           if (err) {
  //             throw err;
  //           } else {
  //             res.send(docs);
  //           }
  //         });
  //       } else {
  //         res.render('error');
  //       }
  //     });
  //   } else {
  //     return res.render('error');
  //   }
  // });
  app.get('/money', function(req, res) {
    mongoose.connection.db.collection('money').find().toArray(function(err, docs) {
      if (err) {
        res.redirect('../error');
      } else {
        res.send(docs);
      }
    });
  });
  app.get('/routes', function(req, res) {
    mongoose.connection.db.collection('routes').find().toArray(function(err, docs) {
      if (err) {
        res.redirect('../error');
      } else {
        res.send(docs);
      }
    });
  });
  // app.get('/suspicious', function(req, res) {
  //   mongoose.connection.db.collection('suspicious').find().toArray(function(err, docs) {
  //     if (err) {
  //       res.redirect('../error');
  //     } else {
  //       res.send(docs);
  //     }
  //   });
  // });
  app.get('/', require('./shpore').get);
  app.get('/shpore/:id', require('./shpore').get);
  app.get('/shpore', require('./shporetwo').get);
  app.post('/shpore', require('./about').post);

  app.get('/login', require('./login').get);
  app.post('/login', require('./login').post);

  app.get('/admin', require('./admin').get);
  app.get('/error', require('./error').get);
  app.get('/guest/:id', require('./guest').get);

  app.get('/personal_room', require('./personal_room').get);
  // app.post('/personal_room', require('./personal_room').post);

  app.get('/setting', require('./setting').get);
  app.post('/setting', require('./setting').post);

  app.get('/upload', require('./upload').get);
  app.post('/upload', require('./upload').post);

  app.get('/contact', require('./contact').get);

  app.get('/about', require('./about').get);
  app.post('/about', require('./about').post);
  app.get('/shpore_admin/:id', require('./shpore_admin').get);
  app.get('/suspicious', require('./suspicious').get);
  app.get('/books', require('./books').get);
  app.post('/books', require('./books').post);

  app.get('/adminsetting', require('./adminsetting').get);
  app.post('/adminsetting', require('./adminsetting').post);

  app.get('/math', require('./about').get);
  app.post('/math', require('./about').post);
};

