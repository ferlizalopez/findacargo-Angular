var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var config = {
  "db": "findacargo",  
  "host": "localhost",
  "port": 27017
};

var port = (config.port.length > 0) ? (":" + config.port) : '';
//var login = (config.user.length > 0) ? config.user + ":" + config.pw + "@" : '';
var uristring = "mongodb://"  + config.host + port + "/" + config.db;

var mongoOptions = { db: { safe: true } };

// Connect to Database
mongoose.connect(uristring, mongoOptions, function (err, res) {
  if(err){
    console.log('ERROR connecting to: ' + uristring + '. ' + err);
  }else{
    console.log('Successfully connected to: ' + uristring);
  }
});

exports.mongoose = mongoose;