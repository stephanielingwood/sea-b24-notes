'use strict';

require('../../app/js/client');
require('angular-mocks');

describe('NotesController', function() {
  var $controllerConstructor;
  var $httpBackend;
  var $scope;
  var $cookies;

  beforeEach(angular.mock.module('notesApp', 'ngCookies'));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $cookies = {};
    $controllerConstructor = $controller;
  }));

  it('should be able to create a controller', function() {
    $cookies.jwt = 'fakeJWT';
    var notesController = $controllerConstructor('notesCtrl', {$scope: $scope, $cookies: $cookies});
    expect(typeof notesController).toBe('object');
  });

  describe('rest request', function() {

    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $controllerConstructor('notesCtrl', {$scope: $scope, $cookies: $cookies});
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should require a valid login to access notes', function() {
      $cookies.jwt = '';
      $scope.index();
      expect($scope.notes).toBe(undefined);
    });

    it('makes a call to index', function() {
      $cookies.jwt = 'fakeJWT';
      $httpBackend.expectGET('/api/notes').respond(200, [{'noteBody': 'test note', '_id': '1'}]);

      $scope.index();
      $httpBackend.flush();

      expect($scope.notes).toBeDefined();
      expect(Array.isArray($scope.notes)).toBeTruthy();
      expect(typeof $scope.notes[0]).toBe('object');
      expect($scope.notes[0].noteBody).toBe('test note');
    });

    it('should save a new note', function() {
      $cookies.jwt = 'fakeJWT';
      $httpBackend.expectPOST('/api/notes').respond(200, {'noteBody': 'test note', '_id': 1});
      $scope.notes = [];
      $scope.newNote = {'noteBody': 'test note'};
      $scope.saveNewNote();

      $httpBackend.flush();

      expect($scope.notes.length).toBe(1);
      expect($scope.notes[0].noteBody).toBe('test note');
      expect($scope.newNote).toBe(null);
    });

    it('it should delete a note', function() {
      $cookies.jwt = 'fakeJWT';
      $httpBackend.expectDELETE('/api/notes/1').respond(200);
      var note = {'noteBody':'test note', '_id': 1};
      $scope.notes = [note];

      $scope.deleteNote(note);

      $httpBackend.flush();

      expect($scope.notes.length).toBe(0);
    });

    it('it should edit a note', function() {
      $cookies.jwt = 'fakeJWT';
      $httpBackend.expectPUT('/api/notes/1').respond(200);

      var note = {'noteBody': 'test note', '_id': 1};
      $scope.notes = [note];
      note.noteBody = 'changed test';

      $scope.saveNote(note);

      $httpBackend.flush();

      expect($scope.notes.length).toBe(1);
      expect($scope.notes[0].noteBody).toBe('changed test');
    });
  });
});
