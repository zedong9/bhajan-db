var expect = require('chai').expect;
var request = require('superagent');
var db = require('../../models').Database;

describe('Database', function () {
    it('should connect without error.', function (done) {
        db.connect('bhajans', function (error, client) {
            done(error);
            client.close();
        });
    });
});
