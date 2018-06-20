var mongoose = require("mongoose");

// save a reference to the schema constructor
var Schema = mongoose.Schema;

// using the schema constructor, create a new noteschema object

var NoteSchema = new Schema({
    // title is string type
    title: String,
    // body is string type
    body: String
});

// this creates our model from the above schema, using mongooses model method
var Note = mongoose.model("Note", NoteSchema);

// export the note model
module.exports = Note;