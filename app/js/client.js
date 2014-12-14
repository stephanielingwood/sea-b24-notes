'use strict';

require('angular/angular');
require('angular-route');
require('angular-cookies');
require('angular-base64');

var notesApp = angular.module('notesApp', ['ngRoute', 'ngCookies', 'base64']);

//services
require('./services/resource_backend_service')(notesApp);
require('./users/services/user_service')(notesApp);

//controllers
require('./notes/controllers/notes_controller')(notesApp);
require('./users/controllers/auth_controller')(notesApp);
require('./users/controllers/loggedin_controller')(notesApp);

notesApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/notes', {
    templateUrl: 'templates/notes/notes_template.html',
    controller: 'notesCtrl'
  })
  .when('/users', {
    templateUrl: 'templates/users/auth_template.html',
    controller: 'authCtrl'
  })
  .otherwise({
    redirectTo: '/users'
  });
}]);
