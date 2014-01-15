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

var test_id = 'test_' + moment().format('MMDDYYYY_HH:mm:ss:SSS');

// Allow linting to pass.
/*jshint expr: true*/

before(function (done) {
    db.connect('bhajans', function (error, client, bhajans) {
        if (error) return done(error);
        bhajans.insert([
            {bhajan_id: unique_id_1, title: unique_title, test: test_id, approved: true},
            {bhajan_id: unique_id_2, title: unique_title, test: test_id, approved: true},
            {bhajan_id: unique_id_3, title: unique_title, test: test_id, approved: false},
            {bhajan_id: 'not searchable', title: 'not searchable', test: test_id}
        ], function (error) {
            if (error) return done(error);
            client.close();
            done();
        });
    });
});

describe('Bhajan findOne', function () {
    it('should be a function.', function () {
        expect(Bhajan.findOne).to.be.a('function');
    });

    it('should not find more than one result.', function (next) {
        Bhajan.findOne({bhajan_id: unique_id_1}, function (error, result) {
            if (error) return next(error);
            expect(result).to.be.an('object');
            expect(result.bhajan_id).to.equal(unique_id_1);

            Bhajan.findOne({bhajan_id: unique_id_2}, function (error, result) {
                if (error) return next(error);
                expect(result).to.be.an('object');
                expect(result.bhajan_id).to.equal(unique_id_2);
                next();
            });
        });
    });

    it('should throw an error if there are no results.', function (next) {
        Bhajan.findOne({bhajan_id: 'This bhajan doesn\'t exist'}, function (error, result) {
            expect(error.name).to.equal('Error');
            expect(error.message).to.equal('This bhajan does not exist.');
            next();
        });
    });
});

describe('Bhajan search', function () {
    it('should be a function.', function () {
        expect(Bhajan.search).to.be.a('function');
    });

    it('should return an array of objects.', function (next) {
        Bhajan.search({title: unique_title, test: test_id}, function (error, result) {
            if (error) return next(error);
            expect(result).to.be.an('array');
            expect(result.length).to.equal(2);
            next();
        });
    });

    it('should be case insensitive.', function (next) {
        Bhajan.search({title: unique_title.toUpperCase(), test: test_id}, function (error, result) {
            if (error) return next(error);
            expect(result).to.be.an('array');
            expect(result.length).to.equal(2);
            next();
        });
    });

    it('should return an empty array if no search results.', function (next) {
        Bhajan.search({title: 'This bhajan doesn\'t exist'}, function (error, result) {
            if (error) return next(error);
            expect(result).to.be.an('array');
            expect(result.length).to.equal(0);
            next();
        });
    });

    it('should allow searching for unapproved bhajans.', function (next) {
        Bhajan.search({approved: false, test: test_id}, function (error, result) {
            if (error) return next(error);
            expect(result).to.be.an('array');
            expect(result.length).to.equal(1);
            next();
        });
    });
});

describe('Bhajan update', function () {
    var updated_bhajan;

    before(function (done) {
        Bhajan.update({bhajan_id: unique_id_3, translation: 'updated translation'}, function (error, bhajan) {
            if (error) return done(error);
            updated_bhajan = bhajan;
            done();
        });
    });

    it('is a function.', function () {
       expect(Bhajan.update).to.be.a('function');
    });

    it('updates the bhajan with provided data.', function () {
        expect(updated_bhajan.translation).to.equal('updated translation');
    });

    it('does not modify other data.', function () {
        expect(updated_bhajan.bhajan_id).to.equal(unique_id_3);
        expect(updated_bhajan.title).to.equal(unique_title);
    });

    it('updates the updatedAt field.', function () {
        expect(moment().diff(moment(updated_bhajan.updatedAt))).to.be.below(5000);
    });
});

describe('Bhajan create', function () {
    var created_bhajan;

    before(function (done) {
        Bhajan.create({
            title: 'Test bhajan',
            lyrics: 'test lyrics\r\nthis is line 2\r\nthis is line 3',
            test: test_id
        }, function (error, bhajan) {
            if (error) return done(error);
            created_bhajan = bhajan;
            done();
        });
    });

    it('should be a function.', function () {
        expect(Bhajan.create).to.be.a('function');
    });

    it('should sanitize provided data and return inserted row.', function () {
        expect(created_bhajan.title).to.equal('Test Bhajan');
        expect(created_bhajan.lyrics).to.equal('Test Lyrics\\nThis Is Line 2\\nThis Is Line 3');
    });

    it('should add a bhajan_id field.', function () {
        expect(created_bhajan.bhajan_id).to.exist;
    });

    it('should not approve the bhajan by default.', function () {
        expect(created_bhajan.approved).to.equal(false);
    });

    it('should add a createdAt field.', function () {
        expect(created_bhajan.createdAt).to.exist;
        expect(moment().diff(moment(created_bhajan.createdAt))).to.be.below(5000);
    });

    it('should fail if lyrics are not provided.', function (next) {
        Bhajan.create({title: uuid.v4()}, function (error, result) {
            expect(error).to.exist;
            next();
        });
    });
});

after(function (done) {
    db.connect('bhajans', function (error, client, bhajans) {
        if (error) return done(error);
        bhajans.remove({test: test_id}, function (error) {
            if (error) done(error);
            client.close();
            done();
        });
    });
});
