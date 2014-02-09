var expect = require('chai').expect;
var moment = require('moment');
var hash = require('password-hash');
var uuid = require('node-uuid');
var _ = require('underscore');

var models = require('../../models');
var User = models.User;
var db = models.Database;

var username = uuid.v4();
var password = uuid.v4();

var test_id = 'test_' + moment().format('MMDDYYYY_HH:mm:ss:SSS');

before(function (done) {
    db.connect('users', function (error, client, users) {
        users.insert({
            username: username,
            password: hash.generate(password),
            test: test_id
        }, function (error, inserted_user) {
            if (error) return done(error);
            client.close();
            done();
        });
    });
});

describe('User', function () {
    it('should fail authentication if user does not exist.', function (next) {
        User.validate(uuid.v4(), password, function (error, result) {
            if (error) return next(error);
            expect(result).to.equal(false);
            next();
        });
    });

    it('should fail authentication if user exists and password is incorrect.', function (next) {
        User.validate(username, uuid.v4(), function (error, result) {
            if (error) return next(error);
            expect(result).to.equal(false);
            next();
        });
    });

    it('should pass authentication if user exists and password is correct.', function (next) {
        User.validate(username, password, function (error, result) {
            if (error) return next(error);
            expect(result.username).to.equal(username);
            expect(hash.verify(password, result.password)).to.equal(true);
            next();
        });
    });
});

after(function (done) {
    db.connect('users', function (error, client, users) {
        users.remove({test: test_id}, function (error) {
            if (error) return done(error);
            client.close();
            done();
        });
    });
});
