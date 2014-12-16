'use strict';

//Many thanks to Charles Renwick for help with the testing code.

process.env.MONGO_URL = 'mongodb://localhost/notes_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

describe('user functionality', function() {
  var id;
  var jwtToken;
  it('should be able to create a new user', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test@example.com', password: 'Password123#'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      jwtToken = res.body.jwt;
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
  var jwtToken;

  before(function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'test7@example.com', password: 'Password123#'})
    .end(function(err, res) {
      jwtToken = res.body.jwt;
      done();
    });
  });

  it('should be able to create a note', function(done) {
    this.timeout(5000);
    chai.request('http://localhost:3000')
    .post('/api/notes')
    .set({'jwt': jwtToken})
    .send({noteBody: 'hello world'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('_id');
      id = res.body._id;
      expect(res.body.noteBody).to.eql('hello world');
      done();
    });
  });

  it('should be able to get an index', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/notes')
    .set({jwt: jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.eql(true);
      done();
    });
  });

  it('should be able to get a single note', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/notes/' + id)
    .set({jwt: jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.noteBody).to.eql('hello world');
      done();
    });
  });

  it('should be able to update a note', function(done) {
    chai.request('http://localhost:3000')
    .put('/api/notes/' + id)
    .set({jwt: jwtToken})
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
    .set({jwt: jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('success!');
      done();
    });
  });

  it('should not let someone post an empty note', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/notes')
    .set({jwt: jwtToken})
    .send({noteBody: ''})
    .end(function(err, res) {
      expect(res.status).to.eql(500);
      expect(err).to.eql(null);
      expect(res.body.noteBody.message).to.eql('blank notes make me sad');
      done();
    });
  });
});
