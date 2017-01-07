var urlResolver = require('../modules/url-resolver');

module.exports = function (server) {

    server.get('/api/status', function (req, res) {
        var url = decodeURI(req.query.url);
        if (!url) {
            res.send("Please pass url param in query string");
        }
        urlResolver.get(url, function callback(result) {
            var status = result ? "Running" : "Down";
            res.send("The server status is " + status);
        });
    });

    server.get('/api/status/ping', function (req, res) {
        var url = decodeURI(req.query.url);
        if (!url) {
            res.send("Please pass url param in query string");
        }
        urlResolver.ping(url, function callback(result) {
            var status = result ? "Running" : "Down";
            res.send("The server status is " + status);
        });
    });

};