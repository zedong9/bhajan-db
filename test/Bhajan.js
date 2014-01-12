var expect = require('chai').expect;
var moment = require('moment');
var uuid = require('node-uuid');
var _ = require('underscore');

var models = require('../models');
var Bhajan = models.Bhajan;
var db = models.Database;

var unique_id_1 = uuid.v4();
var unique_id_2 = uuid.v4();
var unique_id_3 = uuid.v4();
var unique_title = uuid.v4();

var test_id = 'test_' + uuid.v4();

// Allow linting to pass.
/*jshint expr: true*/

before(function (done) {
    db.connect('bhajans', function (error, client, bhajans) {
        if (error) done(error);
        else {
            bhajans.insert([
                {bhajan_id: unique_id_1, title: unique_title, test: test_id, approved: true},
                {bhajan_id: unique_id_2, title: unique_title, test: test_id, approved: true},
                {bhajan_id: unique_id_3, title: unique_title, test: test_id, approved: false},
                {bhajan_id: 'not searchable', title: 'not searchable', test: test_id}
            ], function (error) {
                if (error) throw error;
                client.close();
                done();
            });
        }
    });
});

describe('Bhajan findOne', function () {
    it('should be a function.', function (next) {
        expect(Bhajan.findOne).to.be.a('function');
        next();
    });

    it('should not find more than one result.', function (next) {
        Bhajan.findOne({bhajan_id: unique_id_1}, function (error, result) {
            if (error) next(error);
            else {
                expect(result).to.be.an('object');
                expect(result.bhajan_id).to.equal(unique_id_1);

                Bhajan.findOne({bhajan_id: unique_id_2}, function (error, result) {
                    if (error) next(error);
                    else {
                        expect(result).to.be.an('object');
                        expect(result.bhajan_id).to.equal(unique_id_2);
                        next();
                    }
                });
            }
        });
    });

    it('should throw an error if there are no results.', function (next) {
        Bhajan.findOne({bhajan_id: 'This bhajan doesn\'t exist'}, function (error, result) {
            expect(error.name).to.equal('Error');
            expect(error.message).to.equal('This bhajan does not exist anymore.');
            next();
        });
    });
});

describe('Bhajan search', function () {
    it('should be a function.', function (next) {
        expect(Bhajan.search).to.be.a('function');
        next();
    });

    it('should return an array of objects.', function (next) {
        Bhajan.search({title: unique_title, test: test_id}, function (error, result) {
            if (error) next(error);
            else {
                expect(result).to.be.an('array');
                expect(result.length).to.equal(2);
                next();
            }
        });
    });

    it('should be case insensitive.', function (next) {
        Bhajan.search({title: unique_title.toUpperCase(), test: test_id}, function (error, result) {
            if (error) next(error);
            else {
                expect(result).to.be.an('array');
                expect(result.length).to.equal(2);
                next();
            }
        });
    });

    it('should return an empty array if no search results.', function (next) {
        Bhajan.search({title: 'This bhajan doesn\'t exist'}, function (error, result) {
            if (error) next(error);
            else {
                expect(result).to.be.an('array');
                expect(result.length).to.equal(0);
                next();
            }
        });
    });

    it('should allow searching for unapproved bhajans.', function (next) {
        Bhajan.search({approved: false, test: test_id}, function (error, result) {
            if (error) next(error);
            else {
                expect(result).to.be.an('array');
                expect(result.length).to.equal(1);
                next();
            }
        });
    });
});

after(function (done) {
    db.connect('bhajans', function (error, client, bhajans) {
        if (error) done(error);
        else {
            bhajans.remove({test: test_id}, function (error) {
                if (error) done(error);
                client.close();
                done();
            });
        }
    });
});
