var request = require('request');
var urlParser = require('url');
const dns = require('dns');
const constants = require('../constants');

/**
 * @name url-resolver.get
 * @description try to send get http request to specified url
 * @param url
 * @param callback: return true if ok response, else return false 
 */
var get = function (url, callback) {
    request(
        url,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(true);
            } else {
                callback(false);
            }
        }
    );
};

//TODO: complete, it not working yet
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

/**
 * @name url-resolver.resolve
 * @description try to resolve url based on type
 * @param url
 * @param resolve type {get: 1, post: 2, ping: 3}
 * @default @param type is get
 * @param callback: return true hostname is resolved with ip addresses, else false
 */
var resolve = function (url, type, callback) {
    if (!url || !callback) {
        return;
    }

    if (type == constants.resolveType.httpPost) {
        console.log('post');
        post(url, function (result) {
            callback(result);
        });
    } else if (type == constants.resolveType.ping) {
        console.log('ping');
        ping(url, function (result) {
            callback(result);
        });
    } else {
        console.log('get');
        get(url, function (result) {
            callback(result);
        });
    }
}

module.exports = {
    resolve: resolve,
    get: get,
    post: post,
    ping: ping
}