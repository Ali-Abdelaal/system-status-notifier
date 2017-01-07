/*
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var server = express();
server.use(bodyParser.json())
server.use(cors());

require('./auth')(server);

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
*/

var utils = require('./modules/utils.js');
utils.readFile("package.jsons");