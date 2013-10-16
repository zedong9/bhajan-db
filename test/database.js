var expect = require('chai').expect;
var request = require('superagent');

var db_location = 'localhost:28017';

describe('Database', function () {
    it('should be running.', function () {
        request.get(db_location).end(function (res) {
            expect(res).to.exist;
            expect(res.status).to.equal(200);
            expect(res.text).to.contain('mongod');
        });
    });
});
