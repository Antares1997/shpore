var mongoose = require('../libs/mongoose.js');
var ObjectID = require('mongodb').ObjectID;
// const formidable = require('express-formidable');
var fs = require('fs');
exports.get = function(req, res) {
  if (req.session.user !== undefined) {
    mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, doc) {
      if (err) throw err;
      if (doc.username === 'admin') {
        mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, user) {
          if (err) throw err;
          if (user.username === 'admin') {
            mongoose.connection.db.collection('routes').find().toArray(function(err, routes) {
              if (err) throw err;
              res.render('adminsetting', {routes: routes});
            });
          } else {
            return res.render('error');
          }
        });
      } else {
        return res.render('error');
      }
    });
  } else {
    return res.render('error');
  }
};
exports.post = function(req, res) {
  var subject, name, url;
  subject = JSON.stringify(req.body);
  var objone;
  subject = subject.split(' ');
  objone = subject[2].split('\\n')[2].split('\\r')[0].split('_');
  name = objone[0];
  url = objone[1];
  var fileName = url + '.js';
  var myString;
  // fs.open(path.join(__dirname, '../public/js/'), 'a+', function(err) {
  // if (err) throw err;
  fs.exists('./routes/shpore.js', function(exists) {
    if (exists) { // results true
      fs.readFile('./routes/shpore.js', {encoding: 'utf8'}, (err, data) => {
        if (err) throw err;
        myString = data;
        fs.exists('./public/temp/' + fileName, function(exist) {
          if (exist) {
            res.send({status: 'bad', subject: name});
            console.log('Файл с этим именем уже существует!');
            return;
          } else {
            var rout = {
              name: name,
              url: url
            };
            fs.writeFile('./public/temp/' + fileName, myString, (err) => {
              if (err) throw err;
            });
            mongoose.connection.db.collection('routes').insert(rout, function(err) {
              if (err) throw err;
            });
            res.send({status: 'ok', subject: name});
            console.log('ok');
          }
        });
      });

    }
  });
};
