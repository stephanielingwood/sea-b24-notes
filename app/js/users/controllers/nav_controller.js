'use strict';

module.exports = function(app) {
  app.controller('navCtrl', ['$scope', '$http', '$cookies', '$location', 'userService', function($scope, $http, $cookies, $location, userService) {

    $scope.user = {
      jwt: $cookies.jwt,
      email: $cookies.email
    };

    $scope.includeDirective = function() {
      if ($cookies.jwt) {
        return true;
      }
      return false;
    };

    $scope.signOut = function($cookies) {
      userService.signOut($cookies);
      $location.path('/users');
      return $cookies;
    };

  }]);
};
