'use strict';

module.exports = function(app) {
  app.controller('authCtrl', ['$scope', '$http', '$cookies', '$base64', '$location', function($scope, $http, $cookies, $base64, $location) {

    $scope.errors = [];

    $scope.signIn = function() {
      $scope.errors = [];

      $http.defaults.headers.common['Authorization'] = 'Basic ' + $base64.encode($scope.user.email + ':' + $scope.user.password); //jshint ignore:line

      $http({
        method: 'GET',
        url: '/api/users'
      })
      .success(function(data) {
        $cookies.jwt = data.jwt;
        // jscs: disable
        $location.path('/notes'); //jshint ignore:line
        // jscs: enable
      })
      .error(function(data) {
        $scope.errors.push(data);
      });
    };

    $scope.signUp = function() {
      $scope.errors = [];

      if ($scope.newUser.password !== $scope.newUser.passwordConfirmation) $scope.errors.push({msg: 'password and confirmation did not match'});
      if (!$scope.newUser.email) $scope.errors.push({msg: 'did not specify an email'});
      if ($scope.errors.length) return;

      $http({
        method: 'POST',
        url: '/api/users',
        data: $scope.newUser
      })
      .success(function(data) {
        $cookies.jwt = data.jwt;
        // jscs: disable
        $location.path('/notes'); //jshint ignore:line
        // jscs: enable
      })
      .error(function() {
        $scope.errors.push({msg: 'could not create user'});
      });
    };

  }]);
};
