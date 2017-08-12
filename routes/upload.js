var mongoose = require('../libs/mongoose.js');
var fs = require('fs');
var multiparty = require('multiparty');
var ObjectID = require('mongodb').ObjectID;
var dbmoney;
var NumberOfDowndload;
exports.get = function(req, res) {
  if (req.session.user !== undefined) {
    mongoose.connection.db.collection('money').findOne({_id: ObjectID(req.session.user)}, function(err, doc) {
      if (err) {
        res.render('error');
      } else {
        var money = doc.money;
        mongoose.connection.db.collection('routes').find().toArray(function(err, routes) {
          if (err) throw err;
          return res.render('upload', {money: money, routes: routes});
        });

      }
    });

  } else {
    return res.render('error');
  }
};
var period = 86400000;
var interval = setInterval(function() {
  mongoose.connection.db.collection('money').find().toArray(function(err, docs) {
    if (err) {
      throw err;

    } else {
      for (var i = 0; i < 5; i++) {
        mongoose.connection.db.collection('money').update({NumberOfDowndload: i},
          {NumberOfDowndload: 5}
        );
      }
    }
  });

}, period);

exports.post = function(req, res) {
  // create a form to begin parsing
  var form = new multiparty.Form();
  var uploadFile = {uploadPath: '', type: '', size: 0};
  var maxSize = 20 * 1024 * 1024; // 20MB
  var supportMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf'];
  var errors = [];
  form.on('error', function(err) {
    if (err) throw err;
    if (fs.existsSync(uploadFile.path)) {
      fs.unlinkSync(uploadFile.path);
      console.log('error');
    }
  });
  form.on('close', function() {
    if (errors.length !== 0) {
      if (fs.existsSync(uploadFile.path)) {
        fs.unlinkSync(uploadFile.path);
      }
      res.send({status: 'bad', errors: errors});
    }
  });
  // listen on part event for image file

  form.on('part', function(part) {

    var walk = require('walk');
    var files = [];
    // Walker options
    uploadFile.size = part.byteCount;
    uploadFile.type = part.headers['content-type'];
    var type = uploadFile.type.split('/');
    var walker = walk.walk('./public/files', { followLinks: false });
    walker.on('file', function(root, stat, next) {
      // Add this file to the list of files
      files.push(root + '/' + stat.name);
      next();
    });
    var name = part.name + '.' + type[1];
    var url;
    walker.on('end', function() {

    });
    mongoose.connection.db.collection('books').findOne({name: name}, function(err, doc) {
      if (err) {
        throw err;
      } else {
        if (doc) {
          errors.push('Не удалось, файл с таким именем уже существует!');
          res.send({status: 'bad', errors: 'Не удалось, файл с таким именем уже существует!', origin: 0});
        } else {
          url = uploadFile.path;
          var temp = url.split('/');
          temp.splice(0, 2);
          url = './' + temp.join('/');
          console.log(uploadFile.size);
          mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, doc) {
            if (err) throw err;
            mongoose.connection.db.collection('books').find().toArray(function(err, docs) {
              if (err) {
                return res.send('Error');
              } else {
                var rdocs = docs.reverse();
                // rdocs.shift();
                rdocs.map(function(x) {
                  if ((x.size > uploadFile.size - 10) && (x.size < uploadFile.size + 10)) {
                    mongoose.connection.db.collection('suspicious').insert(x);
                  }
                });
              }
            });
            var date = new Date();
            mongoose.connection.db.collection('books').insert(
              {name: name, url: url, origin: 1, size: uploadFile.size, uploader: doc._id, data: date});
          });
          mongoose.connection.db.collection('users').findOne({_id: ObjectID(req.session.user)}, function(err, userdb) {
            var user = userdb.username;
            if (err) {
              res.send('Error!');
            } else {

              mongoose.connection.db.collection('money').findOne({_id: ObjectID(req.session.user)}, function(err, doc) {
                if (err) {
                  console.log(err);
                } else {
                  dbmoney = doc.money + 10;
                  NumberOfDowndload = doc.NumberOfDowndload - 1;
                  if (NumberOfDowndload < 0) {
                    errors.push('Можливiсть завантажувати вичерпана!');
                    return res.send(
                      {status: 'bad', errors: 'Можливiсть завантажувати вичерпана!', origin: 1, money: dbmoney, NumberOfDowndload: NumberOfDowndload}
                    );
                  } else {
                    mongoose.connection.db.collection('money').updateOne(
                      {_id: ObjectID(doc._id)},
                      {
                        _id: ObjectID(doc._id),
                        money: dbmoney,
                        name: user,
                        NumberOfDowndload: NumberOfDowndload
                      },
                      function(res) {
                      }
                    );
                  }
                  res.send({status: 'ok', text: 'Успешно', origin: 1, money: dbmoney, NumberOfDowndload: NumberOfDowndload});

                }
                if (errors.length === 0) {
                  var out = fs.createWriteStream(uploadFile.path);
                  part.pipe(out);
                } else {
                  part.resume();
                }
              });
            }
          });
        }
      }
    });

    uploadFile.path = './public/files/' + name;
    if (uploadFile.size > maxSize) {
      errors.push('File size is ' + uploadFile.size / 1024 / 1024 + '. Limit is' + (maxSize / 1024 / 1024) + 'MB.');
    }

    if (supportMimeTypes.indexOf(uploadFile.type) === -1) {
      errors.push('Unsupported mimetype ' + uploadFile.type);
    }


  });
  // parse the form
  form.parse(req);
};
