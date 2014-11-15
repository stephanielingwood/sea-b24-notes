/*jshint node: true */
'use strict';

process.env.MONGO_URL = 'mongodb://localhost/notes_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

describe('user creation', function() {
  var id;
  var jwt;
  it('should be able to create a new user', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test@example.com', password: 'Password123#'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      jwt = res.body.jwt;
      done();
    });
  });
});

describe('user password tests', function() {


  it('should not let a user have a password without a number', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test2@example.com', password: 'testtestT$'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('password must contain at least one number');
      done();
    });
  });

  it('should not let a user have a password without a lower case letter', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test3@example.com', password: 'TESTTEST1%'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('password must contain at least one lower case letter');
      done();
    });
  });

  it('should not let a user have a password without an upper case letter', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test4@example.com', password: 'testtest1%'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('password must contain at least one upper case letter');
      done();
    });
  });

  it('should not let a user have a password without a special character', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test5@example.com', password: 'testtestT1'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('password must contain at least one special character');
      done();
    });
  });

  it('should not let a user have a password less than 8 characters long', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test6@example.com', password: 'tE$t1'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('password must be at least 8 characters long');
      done();
    });
  });
});


describe('basic notes crud', function() {
  var id;
  var jwt;
  it('should be able to create a new user', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test@example.com', password: 'Password123#'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      jwt = res.body.jwt;
      done();
    });
  });

  it('should be able to get an index', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/notes')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.be.true;
      done();
    });
  });

  it('should be able to get a single note', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/notes/' + id)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('hello world');
      done();
    });
  });

  it('should be able to update a note', function(done) {
    chai.request('http://localhost:3000')
    .put('/api/notes/' + id)
    .send({noteBody: 'new note body'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('new note body');
      done();
    });
  });

  it('should be able to destroy a note', function(done) {
    chai.request('http://localhost:3000')
    .delete('/api/notes/' + id)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('success!');
      done();
    });
  });
});
