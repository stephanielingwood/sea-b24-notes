'use strict';
//Thanks to Paul Laskowski for helping figure out the error handling. When included in the router, we could only test error status; the error message from the validator didn't get passed to the Express (we think) error handler.


var mongoose = require('mongoose');

var noteSchema = mongoose.Schema({
  noteBody: { type: String, validate: [validNoteBody, 'blank notes make me sad']}
});

//we learned you have to use this function construction!
function validNoteBody(note) {
  return note.length > 0;
}

module.exports = mongoose.model('Note', noteSchema);



