'use strict';

module.exports = function(app) {
  app.directive('navDirec', ['$cookies', '$location', function($cookies, $location) {
    return {
      restrict: 'EA',
      templateUrl: '/templates/users/directives/nav_direc.html',
      scope: {
        email: '@',
        signOut: '&'
      },
      controller: function($scope, $cookies) {
        $scope.signOut($cookies);
      }
    };
  }]);
};
