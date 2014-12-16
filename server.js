'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var passport = require('passport');
var app = express();

var url = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/notes-development';

mongoose.connect(process.env.MONGO_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/notes_development');
app.use(bodyparser.json());

app.set('jwtSecret', process.env.JWT_SECRET || 'changethisordie');

app.use(express.static(__dirname + '/build'));

app.use(passport.initialize());

require('./lib/passport')(passport);
var jwtauth = require('./lib/jwt_auth')(app.get('jwtSecret'));

var notesRouter = express.Router();
notesRouter.use(jwtauth);

require('./routes/users_routes')(app, passport);
require('./routes/notes_routes')(notesRouter);
app.use('/', notesRouter);

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log('server running on port: %d', app.get('port'));
});
