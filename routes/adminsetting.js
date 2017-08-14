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
  url = name.toLowerCase();
  var rout = {
    name: name,
    url: url
  };
  var fileName = url + '.ejs';
  // fs.open(path.join(__dirname, '../public/js/'), 'a+', function(err) {
  // if (err) throw err;
  fs.exists('./views/about.ejs', function(exists) {
    if (exists) { // results true
      fs.readFile('./views/about.ejs', {encoding: 'utf8'}, (err, data) => {
        if (err) throw err;
        fs.exists('./views/' + fileName, function(exist) {
          mongoose.connection.db.collection('routes').find().toArray(function(err, routes) {
            if (err) throw err;
            if (routes.length > 0) {
              routes.map(function(x) {
                if (x.name === name) {
                  console.log('Файл с этим именем уже существует!');
                  return res.send({status: 'bad', subject: name});
                } else {
                  doit(res, url, rout);
                }
              });
            } else {
              doit(res, url, rout);
            }
          });
        });
      });

    }
  });
};

function doit(res, url, rout) {
  fs.readFile('./routes/index.js', {encoding: 'utf8'}, (err, data) => {
    if (err) throw err;
    var text = data.substring(0, data.length - 4);
    text += '\n  app.get("/' + url + '", require("./about").get);\n  app.post("/' + url + '", require("./about").post);\n};\n\n';
    text = text.replace(/"/g, "'");
    fs.writeFile('./routes/index.js', text, 'utf8');
  });
  mongoose.connection.db.collection('routes').insert(rout, function(err) {
    if (err) throw err;
  });
  res.send({status: 'ok', routes: rout});
}
