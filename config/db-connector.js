// Mongodb direct connect
var MongoDB = require('mongodb').Db;
var Server = require('mongodb').Server;

var dbConfig = {
        "host": "localhost",
        "port": 27017,
        "name": "findacargo"
    }

// Mongodb mongoose connection
var mongoose = require("mongoose");
mongoose.connect("mongodb://"+dbConfig.host+":"+dbConfig.port+"/"+dbConfig.name);

var db = new MongoDB(dbConfig.name, new Server(dbConfig.host, dbConfig.port, {auto_reconnect: true}), {w: 1});
db.open(function(e, d){
    if (e) {
        console.log(e);
    }else{
        console.log('connected to database :: ' + dbConfig.name);
        var dbm = mongoose.connection;
        dbm.on("error", console.error.bind(console, "connection error"));
        dbm.on("open", function(){console.log("we are connected")});
    }
});

module.exports = db;
