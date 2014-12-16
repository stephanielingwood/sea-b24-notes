'use strict';

//thanks to Jacob Shafer for help with this code

module.exports = function(userData) {

  var email = new Buffer(userData.email, 'base64').toString('ascii');
  var password = new Buffer(userData.password, 'base64').toString('ascii');

  return {email: email, password: password};

};
