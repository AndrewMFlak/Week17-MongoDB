var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require ("mongoose");

// scraping tools located below here

var axios = require("axios");
var cheerio = require("cheerio");

// var db = require("./models");

var PORT = 3000;

// initializing express
var app = express();

// configuring middleware settings below
app.use(logger("dev"));
// use body-parser for handling form submission

app.use(bodyParser.urlencoded({ extended: true}));

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// connect to mongoDB

// start server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
    console.log("http://localhost:3000");
})