'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var app = express();
var url = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/notes-development';

app.use(bodyparser.json());
app.use(express.static(__dirname + '/build'));

mongoose.connect(url);

require('./routes/notes_routes')(app);

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res) {
  res.json({msg: 'hello, world'});
});

app.listen(app.get('port'), function() {
  console.log('server running on port: %d', app.get('port'));
});
