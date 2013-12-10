var expect = require('chai').expect;
var request = require('superagent');
var db = require('../models/Database');

// Allow linting to pass.
/*jshint expr: true*/

describe('Database', function () {
    it('should connect without error.', function (done) {
        db.connect('bhajans', function (error, client) {
            done(error);
            client.close();
        });
    });
});
