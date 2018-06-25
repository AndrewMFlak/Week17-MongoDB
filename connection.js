var mongodb = require('monodb');

var MongoClient = mongodb.MongoClient;

var url = 'mongodb://mongodbWeek17:password123@ds117691.mlab.com:17691/heroku_dj90wvdp';

MongoClient.connect(url, function(err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        console.log('Connection established to ', url);
        // Close connection 
        db.close();
    }
});

// var mysql = require("mysql2");
// require("dotenv").config();
// var connection;

// if (process.env.JAWSDB_URL) {
//     connection = mysql.createConnection(process.env.JAWSDB_URL)}
//     else {
//         connection = mysql.createConnection({
//             'host': process.env.HOST,
//             'port': 3306,
//             'user': process.env.USERID,
//             'password': process.env.PASSWORD,
//             'database': process.env.DATABASE
//         });
//     }




//     connection.connect(function (err) {
//         if (err) {
//             console.error("error connecting: " + err.stack);
//             return;
//         }
//         console.log("connected as id " + connection.threadId);
//     });

    module.exports = connection;