var mongoose = require('libs/mongoose');
var async = require('async');
var User = require('../models/user').User;
async.series([
  open,
  dropDataBase,
  requireModels,
  createUsers
], function(err, results) {
  if (err) {
    throw err;
  } else {
    console.log(results);
  }
  mongoose.disconnect();
});

function open(callback) {
  mongoose.connection.on('open', callback);
}

function dropDataBase(callback) {
  var db = mongoose.connection.db;
  db.dropDataBase(callback);
}
function requireModels(callback) {
  require('models/user');
  async.each(Object.keys(mongoose.models), function(modelName, callback) {
    mongoose.models(modelName).ensureIndex(callback);
  }, callback);
}

function createUsers(callback) {
  // require('/models/user').User;
  var users = [
    {username: 'Sergiy', password: 'supersergiy'},
    {username: 'Vasya', password: 'supervasya'},
    {username: 'Sasha', password: 'supersasha'}
  ];
  async.each(users, function(userData, callback) {
    var user = new mongoose.models.User(userData);
    user.save(callback);
  }, callback);

  async.parallel([
    function(callback) {
      var vasya = new User({username: 'Vasya', password: 'supervasya'});
      vasya.save(function(err) {
        if (err) {
          callback(err, vasya);
        }
      });
    },
    function(callback) {
      var sasha = new User({username: 'Sasha', password: 'supersasha'});
      sasha.save(function(err) {
        if (err) {
          callback(err, sasha);
        }
      });
    },
    function(callback) {
      var sergiy = new User({username: 'Sergiy', password: 'supersergiy'});
      sergiy.save(function(err) {
        if (err) {
          callback(err, sergiy);
        }
      });
    }
  ], callback);
}
