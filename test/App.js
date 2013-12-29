var expect = require('chai').expect;
var http = require('http');
var uuid = require('node-uuid');
var request = require('superagent');

var app = require('../app');

var address = 'localhost:' + app.get('port');

// Allow jshint to pass.
/*jshint expr: true*/

describe('app.js', function () {

    before(function (done) {
        http.createServer(app).listen(3000, function (error, server) {
            if (error) console.log(error);
            done();
        });
    });

    it('responds with 200 code on the homepage.', function () {
        request.get(address).end(function (res) {
            expect(res).to.exist;
            expect(res.status).to.equal(200);
        });
    });

    it('throws a 404 error if page is not found.', function () {
        request.get(address + '/' + uuid.v4()).end(function (res) {
            expect(res).to.exist;
            expect(res.status).to.equal(404);
        });
    });

    it('throws a 500 error for all other errors.', function () {
        request.get(address + '/error').end(function (res) {
            expect(res).to.exist;
            expect(res.status).to.equal(500);
        });
    });
});
