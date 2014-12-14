'use strict';

module.exports = function(app) {
  app.controller('notesCtrl', ['$scope', '$http', '$cookies', '$location', 'ResourceBackend', function($scope, $http, $cookies, $location, ResourceBackend) {

    var notesBackend = new ResourceBackend('notes');

    // if (!$cookies.jwt || $cookies.jwt.length === 0) return $location.path('/users');

    $http.defaults.headers.common['jwt'] = $cookies.jwt; //jshint ignore: line

    $scope.index = function() {
      notesBackend.index()
      .success(function(data) {
        $scope.notes = data;
      });
    };

    $scope.saveNewNote = function() {
      notesBackend.saveNew($scope.newNote)
      .success(function(data) {
        $scope.notes.push(data);
        $scope.newNote = null;
      });
    };

    $scope.saveNote = function(note) {
      notesBackend.save(note)
      .success(function() {
        note.editing = false;
      });
    };

    $scope.deleteNote = function(note) {
      notesBackend.delete(note)
      .success(function() {
        $scope.notes.splice($scope.notes.indexOf(note), 1);
      });
    };
  }]);
};
