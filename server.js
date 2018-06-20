var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// scraping tools located below here

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

// initializing express
var app = express();

// configuring middleware settings below
app.use(logger("dev"));
// use body-parser for handling form submission

app.use(bodyParser.urlencoded({ extended: true }));

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// connect to mongoDB
mongoose.connect("mongodb://localhost/mongoScraper");

// routes

// get route for scraping the website
app.get("/scrape", function (req, res) {
    // grab the body of the html with axios get request
    axios.get("http://www.echojs.com/").then(function (response) {
        // load cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        // grab each h2 in article tag
        $("article h2").each(function (i, element) {
            // save an empty result object
            var result = {};

            // add the text and href of every link and save as properties of object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            // create a new Article using the result object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err);
                });
        });
    })
});

// route for getting all articles from the db
app.get("/articles", function (req, res) {
    // grab every dcoument in the articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // if we find articles then return to client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // if an error occurred send to the client
            res.json(err);
        });
});


app.get("/articles/:id", function (req, res) {
    // using id passed in id parameter prepare query to find in our db...
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            // if we were able to successfully find a article with id send back to client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // if error return to client
            res.json(err);
        });
});

app.post("/articles/:id", function (req, res) {
    // create a new note and pass the req.body to entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // if a note was successfully create find one article with id equal to req.params.id.  Update the article to be associated with the new note
            // {new: true} tells the query that we want it to return the updated User -- it returns the original by default
            // since our mongoose query returns a promise we can chain another .thn which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbarticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});


// start server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
    console.log("http://localhost:3000");
})