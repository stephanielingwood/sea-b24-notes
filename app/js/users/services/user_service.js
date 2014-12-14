'use strict';

module.exports = function(app) {

  app.factory('userService', ['$http', '$cookies', '$base64', '$location', function($http, $cookies, $base64, $location) {

    return {

      signIn: function(user) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $base64.encode(user.email + ':' + user.password); //jshint ignore:line
        return $http({
          method: 'GET',
          url: '/api/users',
          data: user
        });
      },

      signUp: function(user) {
        return $http({
          method: 'POST',
          url: '/api/users',
          data: user
        });
      },

      signOut: function($cookies) {
        $cookies.jwt = undefined;
        $cookies.email = undefined;
        return $cookies;
      }

    };
  }]);
};
