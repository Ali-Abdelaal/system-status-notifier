var urlResolver = require('../lib/url-resolver');

module.exports = function (server) {

    server.get('/api/resolve', function (req, res) {
        var url = decodeURI(req.query.url);
        if (!url) {
            res.send("Please pass url param");
        }
        var type = req.query.type;
        urlResolver.resolve(url, type, function (result) {
            var status = result ? "Running" : "Down";
            res.send("The server status is " + status);
        });
    });

};