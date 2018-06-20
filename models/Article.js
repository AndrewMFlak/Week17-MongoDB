var mongoose = require("mongoose");

// save a reference to the schema constructor
var Schema = mongoose.Schema;

// using the schema constructor, create a new UserSchema object
var ArticleSchema = new Schema({
    title: {
        // title is string value that is required
        type: String,
        required: true
    },
    link: {
        // link is string value that is required
        type: String,
        required: true
    },
    // note is an object that stores the note id
    // the ref property links the ObjectId to the Note model
    // This allows us to populate the article with associated note
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// this creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// export of Article model
module.exports = Article;
