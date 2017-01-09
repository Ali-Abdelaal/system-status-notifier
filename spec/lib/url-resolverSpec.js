describe('url-resolver module', function () {

    var _request = require('request');
    const _dns = require('dns');
    var _urlResolver = require('../../lib/url-resolver');
    var _pingHandler = require('ping');
    const _constants = require('../../lib/constants');
    var urlResolver,
        request,
        dns,
        ping,
        constants;

    beforeEach(function () {
        urlResolver = _urlResolver;
        request = _request;
        dns = _dns;
        ping = _pingHandler;
        constants = _constants;
    });

    it('should be exist', function () {
        expect(!!urlResolver).toBe(true);
    });

    it('isHostName should return true if it valid hostname', function () {
        var validHostname = "google.com";
        var invalidHostname = "http://www.google.com";
        var validResult = urlResolver.isHostName(validHostname);
        var invalidResult = urlResolver.isHostName(invalidHostname);
        expect(validResult).toBe(true);
        expect(invalidResult).toBe(false);
    });

    describe('handleHttpRequestResponse:', function () {
        it('should be exist', function () {
            expect(!!urlResolver.handleHttpRequestResponse).toBe(true);
        });

        it('should return true if 200 series response, else false', function () {
            var response200 = { statusCode: 200 },
                response205 = { statusCode: 205 },
                response300 = { statusCode: 300 },
                response404 = { statusCode: 404 };
            var result200 = urlResolver.handleHttpRequestResponse(null, response200);
            var result205 = urlResolver.handleHttpRequestResponse(null, response205);
            var result300 = urlResolver.handleHttpRequestResponse(null, response300);
            var result404 = urlResolver.handleHttpRequestResponse(null, response404);
            var errorResult = urlResolver.handleHttpRequestResponse('error', null);
            expect(result200).toBe(true);
            expect(result205).toBe(true);
            expect(result300).toBe(false);
            expect(result404).toBe(false);
            expect(errorResult).toBe(false);
        });
    });

    describe('get:', function () {
        it('should be exist', function () {
            expect(!!urlResolver.get).toBe(true);
        });

        it('should be call request.get', function () {
            spyOn(request, 'get');

            var url = "http://www.google.com";
            urlResolver.get(url, function (result) {
            });

            expect(request.get).toHaveBeenCalledWith(url, jasmine.any(Function));
        });
    });

    describe('post:', function () {
        it('should be exist', function () {
            expect(!!urlResolver.post).toBe(true);
        });

        it('should be call request.post', function () {
            spyOn(request, 'post');
            var url = "http://www.google.com";
            urlResolver.post(url, function (result) {
            });

            expect(request.post).toHaveBeenCalled();
        });
    });

    describe('getAddresses:', function () {
        it('should be exist', function () {
            expect(!!urlResolver.getAddresses).toBe(true);
        });

        it('should be call dns.lookup', function () {
            spyOn(urlResolver, 'isHostName').and.callThrough();
            spyOn(dns, 'lookup');
            var url = "http://www.google.com";
            urlResolver.getAddresses(url, function (result) {
            });
            expect(urlResolver.isHostName).toHaveBeenCalled();
            expect(dns.lookup).toHaveBeenCalled();
        });
    });

    describe('ping:', function () {
        it('should be exist', function () {
            expect(!!urlResolver.ping).toBe(true);
        });

        it('should be call ping.sys.probe', function () {
            spyOn(ping.sys, 'probe');
            var target = "192.12.14.2";
            urlResolver.ping(target, function (result) {
            });

            expect(ping.sys.probe).toHaveBeenCalledWith(target, jasmine.any(Function));
        });
    });

    describe('resolve:', function () {
        it('should be exist', function () {
            expect(!!urlResolver.resolve).toBe(true);
        });

        it('should be call a valid method based on type', function () {
            spyOn(urlResolver, 'post').and.callThrough();
            spyOn(urlResolver, 'get').and.callThrough();
            spyOn(urlResolver, 'ping').and.callThrough();

            var target = "http://google.com";
            urlResolver.resolve(target, constants.resolveType.httpPost, function (result) {
            });
            expect(urlResolver.post).toHaveBeenCalled();

            urlResolver.resolve(target, constants.resolveType.httpGet, function (result) {
            });
            expect(urlResolver.get).toHaveBeenCalled();

            urlResolver.resolve(target, constants.resolveType.ping, function (result) {
            });
            expect(urlResolver.ping).toHaveBeenCalled();
        });
    });


});