'use strict';

module.exports = function(app) {
  app.controller('authCtrl', ['$scope', '$http', '$cookies', '$base64', '$location', 'userService', function($scope, $http, $cookies, $base64, $location, $userService) {

    $scope.errors = [];

    $scope.signIn = function() {
      $scope.errors = [];
      var user = {};
      user.email = $scope.user.email;
      user.password = $scope.user.password;

      $userService.signIn(user)
      .success(function(data) {
        $cookies.jwt = data.jwt;
        $cookies.email = $scope.user.email;
        // jscs: disable
        $location.path('/notes'); //jshint ignore:line
        // jscs: enable
      })
      .error(function(error) {
        $scope.errors.push(error);
      });
    };

    $scope.signUp = function() {
      $scope.errors = [];
      var newUser = {};
      newUser.email = $scope.newUser.email;
      newUser.password = $scope.newUser.password;
      if ($scope.newUser.password !== $scope.newUser.passwordConfirmation) $scope.errors.push({msg: 'password and confirmation did not match'});
      if (!$scope.newUser.email) $scope.errors.push({msg: 'did not specify an email'});
      if ($scope.errors.length) return;

      $userService.signUp(newUser)
      .success(function(data) {
        $cookies.jwt = data.jwt;
        $cookies.email = $scope.newUser.email;
        // jscs: disable
        $location.path('/notes'); //jshint ignore:line
        // jscs: enable
      })
      .error(function(error) {
        $scope.errors.push(error);
      });
    };

  }]);
};
