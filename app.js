// import modules
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

// init express server
var server = express();
server.use(bodyParser.json())
server.use(cors());

// import routes
require('./routes/resolve')(server);

// default
server.get('/', function (req, res) {
  res.send("System Status Notifier Api");
});

// run server
server.listen(7000, function () {
  console.log('%s listening at %s', server.name, "7000");
});