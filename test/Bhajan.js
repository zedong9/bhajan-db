var expect = require('chai').expect;
var moment = require('moment');
var uuid = require('node-uuid');
var _ = require('underscore');

var Bhajan = require('../models/Bhajan');
var db = require('../models/Database');

var unique_id_1 = uuid.v4();
var unique_id_2 = uuid.v4();
var unique_title = uuid.v4();

// Allow linting to pass.
/*jshint expr: true*/

before(function (done) {
    db.connect('bhajans', function (error, client, bhajans) {
        if (error) {
            done(error);
        } else {
            bhajans.remove({test: true}, function (error, result) {
                if (error) {
                    done(error);
                } else {
                    bhajans.insert([
                        {bhajan_id: unique_id_1, title: unique_title, test: true, approved: true},
                        {bhajan_id: unique_id_2, title: unique_title, test: true, approved: true},
                        {bhajan_id: unique_id_2, title: unique_title, test: true, approved: false},
                        {bhajan_id: 'not searchable', title: 'not searchable', test: true}
                    ], function (error) {
                        if (error) throw error;
                        client.close();
                        done();
                    });
                }
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
            if (error) {
                next(error);
            } else {
                expect(result).to.be.an('object');
                expect(result.bhajan_id).to.equal(unique_id_1);

                Bhajan.findOne({bhajan_id: unique_id_2}, function (error, result) {
                    if (error) {
                        next(error);
                    } else {
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
        Bhajan.search({title: unique_title}, function (error, result) {
            if (error) {
                next(error);
            } else {
                expect(result).to.be.an('array');
                expect(result.length).to.equal(2);
                next();
            }
        });
    });

    it('should be case insensitive.', function (next) {
        Bhajan.search({title: unique_title.toUpperCase()}, function (error, result) {
            if (error) {
                next(error);
            } else {
                expect(result).to.be.an('array');
                expect(result.length).to.equal(2);
                next();
            }
        });
    });

    it('should return an empty array if no search results.', function (next) {
        Bhajan.search({title: 'This bhajan doesn\'t exist'}, function (error, result) {
            if (error) {
                next(error);
            } else {
                expect(result).to.be.an('array');
                expect(result.length).to.equal(0);
                next();
            }
        });
    });
});
