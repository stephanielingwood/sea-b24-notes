'use strict';

module.exports = function(app) {
  app.controller('notesCtrl', ['$scope', '$http', '$cookies', '$location', 'ResourceBackend', 'userService', function($scope, $http, $cookies, $location, ResourceBackend, userService) {

    var notesBackend = new ResourceBackend('notes');

    $http.defaults.headers.common['jwt'] = $cookies.jwt; //jshint ignore: line

    $scope.index = function() {
      if (!userService.loggedIn($cookies)) return $location.path('/users');
      notesBackend.index()
      .success(function(data) {
        $scope.notes = data;
      });
    };

    $scope.saveNewNote = function() {
      if (!userService.loggedIn($cookies)) return $location.path('/users');
      notesBackend.saveNew($scope.newNote)
      .success(function(data) {
        $scope.notes.push(data);
        $scope.newNote = null;
      });
    };

    $scope.saveNote = function(note) {
      if (!userService.loggedIn($cookies)) return $location.path('/users');
      notesBackend.save(note)
      .success(function() {
        note.editing = false;
      });
    };

    $scope.deleteNote = function(note) {
      if (!userService.loggedIn($cookies)) return $location.path('/users');
      notesBackend.delete(note)
      .success(function() {
        $scope.notes.splice($scope.notes.indexOf(note), 1);
      });
    };
  }]);
};
