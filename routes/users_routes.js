'use strict';

var User = require('../models/user');
var jwt = require('jwt-simple');
var decode = require('../lib/base64decode');

module.exports = function(app, passport) {
  app.get('/api/users', function(req, res) {
    var decodedUser = decode(req.headers);
    User.findOne({'email': decodedUser.email}, function(err, user) {
      if (err) return res.status(500).send('server error');
      if (!user) return res.status(500).send('no such user exists');

    res.json({'jwt': user.generateToken(app.get('jwtSecret'))});
    });
  });

  app.post('/test', function(req, res) {
    console.log(req.body.params);
  });

  app.post('/api/users', function(req, res) {
    var decodedUser = decode(req.body);
    User.findOne({'email': decodedUser.email}, function(err, user) {
      if (err) return res.status(500).send('server error');
      if (user) return res.status(500).send('cannot create that user');

      //check to make sure their password only has letters, numbers, and special characters, and is 8 characters or longer
      var regNum = /[0-9]/;
      var regLower = /[a-z]/;
      var regUpper = /[A-Z]/;
      var regSpecial = /[●!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

      if (!regNum.test(decodedUser.password)) {
        return res.status(500).json({msg: 'password must contain at least one number'});
      }
      if (!regLower.test(decodedUser.password)) {
        return res.status(500).json({msg: 'password must contain at least one lower case letter'});
      }
      if (!regUpper.test(decodedUser.password)) {
        return res.status(500).json({msg: 'password must contain at least one upper case letter'});
      }
      if (!regSpecial.test(decodedUser.password)) {
        return res.status(500).json({msg: 'password must contain at least one special character'});
      }
      if (decodedUser.password.length < 8) {
        return res.status(500).json({msg: 'password must be at least 8 characters long'});
      }

      //if their password meets the above criteria, create a new user and return a JWT
      var newUser = new User();
      newUser.basic.email = decodedUser.email;
      newUser.basic.password = newUser.generateHash(decodedUser.password);
      newUser.save(function(err, data) {
        if (err) return res.status(500).send('server error');
        res.json({'jwt': newUser.generateToken(app.get('jwtSecret'))});
      });

    });
  });
};
