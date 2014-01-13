var expect = require('chai').expect;
var http = require('http');
var uuid = require('node-uuid');
var request = require('superagent');

var app = require('../app');

var port = 3030;
var address;

// Allow jshint to pass.
/*jshint expr: true*/

describe('app.js', function () {

    before(function (done) {
        app.set('port', port);
        address = 'localhost:' + app.get('port');
        http.createServer(app).listen(app.get('port'), function (error, server) {
            if (error) return done(error);
            done();
        });
    });

    it('responds with 200 code on the homepage.', function (done) {
        request.get(address).end(function (res) {
            expect(res).to.exist;
            expect(res.status).to.equal(200);
            done();
        });
    });

    it('throws a 404 error if page is not found.', function (done) {
        request.get(address + '/' + uuid.v4()).end(function (res) {
            expect(res).to.exist;
            expect(res.status).to.equal(404);
            done();
        });
    });

    it('throws a 500 error for all other errors.', function (done) {
        request.get(address + '/error').end(function (res) {
            expect(res).to.exist;
            expect(res.status).to.equal(500);
            done();
        });
    });
});
