'use strict';

module.exports = function(app) {

  app.factory('userService', ['$http', '$cookies', '$base64', '$location', '$q', function($http, $cookies, $base64, $location, $q) {

    return {

      signIn: function(user) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $base64.encode(user.email + ':' + user.password); //jshint ignore:line
        return $http({
          method: 'GET',
          url: '/api/users',
          data: user
        });
      },

      signUp: function(newUser) {
        newUser.email = $base64.encode(newUser.email);
        newUser.password = $base64.encode(newUser.password);
        return $http({
          method: 'POST',
          url: '/api/users',
          data: newUser
        });
      },

      loggedIn: function($cookies) {
        if ($cookies.jwt) return true;
        return false;
      },

      routeLogInCheck: function($location, $q) {
        var deferred = $q.defer();
        if (!this.loggedIn($cookies)) {
          deferred.reject();
          $location.path('/users');
        } else {
          deferred.resolve();
        }
        return deferred.promise;
      },

      signOut: function($cookies) {
        $cookies.jwt = undefined;
        $cookies.email = undefined;
        $location.path('/users');
        return $cookies;
      }

    };
  }]);
};
