'use strict';

module.exports = function(app) {
  app.controller('loggedInCtrl', ['$scope', '$http', '$cookies', '$location', 'userService', function($scope, $http, $cookies, $location, userService) {

    $scope.user = {
      email: $cookies.email
    };

    $scope.signOut = function($cookies) {
      userService.signOut($cookies);
      // $cookies.jwt = undefined;
      // $cookies.email = undefined;
      $location.path('/users');
      return $cookies;
    };

  }]);
};
