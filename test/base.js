var expect = require('chai').expect;
var request = require('superagent');
var http = require('http');
var app = require('../app');

describe('app.js', function () {

    before(function (done) {
        http.createServer(app).listen(3000, function (error, server) {
            if (error) console.log(error);
            console.log('Express server listening on port ' + app.get('port'));
            done();
        });
    });

    it('responds with 200 code.', function (done) {
        request.get('localhost:3000').end(function (res) {
            expect(res).to.exist;
            expect(res.status).to.equal(200);
            expect(res.text).to.contain('Express');
            done();
        });
    });
});
