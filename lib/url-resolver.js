var request = require('request');
var urlParser = require('url');
var pingHandler = require('ping');
var winston = require('winston');
const dns = require('dns');
const constants = require('./constants');

var urlResolver = exports;
/**
 * @description handle http response
 * @returns true if response status is ok, else return false
 */
urlResolver.handleHttpRequestResponse = function (error, response) {
    if (error) {
        return false;
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
        return true;
    } else {
        return false;
    }
};

/**
 * @name url-resolver.get
 * @description try to send get http request to specified url
 * @param url
 * @param callback: return true if ok response, else return false 
 */
urlResolver.get = function (url, callback) {
    request.get(
        url,
        function (error, response) {
            var result = urlResolver.handleHttpRequestResponse(error, response);
            callback(result);
        }
    );
};

/**
 * @name url-resolver.post
 * @description try to send post http request to specified url
 * @param url
 * @param callback: return true if ok response, else return false 
 */
urlResolver.post = function (url, callback) {
    request.post({
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        url: url,
    }, function (error, response) {
        var result = urlResolver.handleHttpRequestResponse(error, response);
        callback(result);
    });
};

/**
 * @name url-resolver.getAddresses
 * @description try get addresses from url
 * @param url
 * @param callback: return resolved addresses
 */
urlResolver.getAddresses = function (url, callback) {
    var hostname = "";
    if (urlResolver.isHostName(url)) {
        hostname = url;
    } else {
        var parsedUrl = urlParser.parse(url, true, true);
        hostname = parsedUrl.hostname;
    }

    dns.lookup(hostname, (err, addresses, family) => {
        callback(addresses);
    });
};

/**
 * @param hostname
 * @returns true if is valid format host name
 */
urlResolver.isHostName = function (hostname) {
    hostnameRegex = new RegExp("^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$");
    return hostnameRegex.test(hostname);
};

/**
 * @param target is ip or hostname
 * @param callback return boolean result
 * @description try to ping ip or host name and result it's status
 */
urlResolver.ping = function (target, callback) {
    pingHandler.sys.probe(target, function (isAlive) {
        callback(isAlive);
    });
};

/**
 * @name url-resolver.resolve
 * @description try to resolve url based on type
 * @param url
 * @param resolve type {get: 1, post: 2, ping: 3}
 * @default @param type is get
 * @param callback: return true is is alive, else false
 */
urlResolver.resolve = function (url, type, callback) {
    winston.log('info', 'type ', type);
    if (!url || !callback) {
        return;
    }

    if (type == constants.resolveType.httpPost) {
        winston.log('info', 'post %s ', url);
        urlResolver.post(url, function (result) {
            callback(result);
        });
    } else if (type == constants.resolveType.ping) {
        winston.log('info', 'ping %s ', url);
        urlResolver.ping(url, function (result) {
            callback(result);
        });
    } else {
        winston.log('info', 'get %s ', url);
        urlResolver.get(url, function (result) {
            callback(result);
        });
    }
};