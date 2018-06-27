var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// scraping tools located below here

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

// initializing express
var app = express();

// configuring middleware settings below
app.use(logger("dev"));
// use body-parser for handling form submission

app.use(bodyParser.urlencoded({ extended: true }));

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// connect to mongoDB to scraper

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = "mongodb://<mongodbWeek17>:<password123>@ds117691.mlab.com:17691/heroku_dj90wvdp" || "mongodb://localhost/mongoScraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// routes

// get route for scraping the website
app.get("/scrape", function (req, res) {
    // grab the body of the html with axios get request
    axios.get('https://beachgrit.com/category/news/').then(function (response) {
        // load cheerio and save it to $ for a shorthand selector

        var $ = cheerio.load(response.data);
        // grab each h2 in article tag

        $('article').each(function (i, element) {
            // save an empty result object
            var result = {};


            // add the text and href of every link and save as properties of object
            // result.image = $(this)
            //     .children()
            // result.image = $(this).children('header').children('a').children('.img-container three-two post__item--img-wrap').children('.bg-img lazy-load').attr('data-src');
            result.title = $(this).children('.entry-summary').children('p').text();
            result.link = $(this).children('header').children('a').attr('href');
            
            // console.log(result.image);
            console.log(result.title);
            console.log(result.link);



            // create a new Article using the result object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // view the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // if an error occurred, send it to client
                    return res.json(err);
                });
        });
        // If we were able to successfully scrape and save an article send a message to the client
        res.send("Scrape Complete");
    });
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

// route used to grab a scpecific Article by id, populate it with its note
app.get("/articles/:id", function (req, res) {
    // using id passed in id parameter prepare query to find in our db...
    db.Article.findOne({ _id: req.params.id })
    //..and populate all of the notes associated with it
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
// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    // create a new note and pass the req.body to entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // if a note was successfully create find one article with id equal to req.params.id.  Update the article to be associated with the new note
            // {new: true} tells the query that we want it to return the updated User -- it returns the original by default
            // since our mongoose query returns a promise we can chain another .thn which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});


// start server
app.listen(PORT, function () {
    console.log("App running on PORT " + PORT);
    console.log("https://murmuring-lake-54090.herokuapp.com/");
    console.log("http://localhost:3000/");
});