var request = require('request');
var urlParser = require('url');
const dns = require('dns');

/**
 * @name url-resolver.get
 * @description try to send get http request to specified url
 * @param url
 * @param callback: return true if ok response, else return false 
 */
var get = function (url, callback) {
    request(
        url,
        { form: { key: 'value' } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
                callback(true);
            } else {
                console.log(error);
                callback(false);
            }
        }
    );
};

/**
 * @name url-resolver.post
 * @description try to send post http request to specified url
 * @param url
 * @param callback: return true if ok response, else return false 
 */
var post = function (url, callback) {
    request.post(
        url,
        { form: { key: 'value' } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(true);
            } else {
                callback(false);
            }
        }
    );
};

/**
 * @name url-resolver.ping
 * @description try to resolve hostname form url
 * @param url
 * @param callback: return true hostname is resolved with ip addresses, else false
 */
var ping = function (url, callback) {
    var parsedUrl = urlParser.parse(url, true, true);
    dns.lookup(parsedUrl.hostname, (err, addresses, family) => {
        console.log('addresses:', addresses);
        if (addresses) {
            callback(true);
        } else {
            callback(false);
        }
    });
};

module.exports = {
    get: get,
    post: post,
    ping: ping
}