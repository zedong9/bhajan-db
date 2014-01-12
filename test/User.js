var expect = require('chai').expect;
var moment = require('moment');
var hash = require('password-hash');
var uuid = require('node-uuid');
var _ = require('underscore');

var models = require('../models');
var User = models.User;
var db = models.Database;

var username = uuid.v4();
var password = uuid.v4();

var test_id = uuid.v4();

describe('User', function () {
    before(function (done) {
        db.connect('users', function (error, client, users) {
            users.insert({
                username: username,
                password: hash.generate(password),
                test: test_id
            }, function (error, inserted_user) {
                if (error) throw error;
                client.close();
                done();
            });
        });
    });

    it('should fail authentication if user does not exist.', function () {
        User.validate(uuid.v4(), password, function (error, result) {
            if (error) throw error;
            expect(result).to.equal(false);
        });
    });

    it('should fail authentication if user exists and password is incorrect.', function () {
        User.validate(username, uuid.v4(), function (error, result) {
            if (error) throw error;
            expect(result).to.equal(false);
        });
    });

    it('should pass authentication if user exists and password is correct.', function () {
        User.validate(username, password, function (error, result) {
            if (error) throw error;
            expect(result.username).to.equal(username);
            expect(hash.verify(password, result.password)).to.equal(true);
        });
    });

    after(function () {
        db.connect('users', function (error, client, users) {
            users.remove({test: test_id}, function (error) {
                if (error) throw error;
                client.close();
            });
        });
    });
});
