var moment = require('moment');
var mongodb = require('mongodb');
var _ = require('underscore');

var db = require('./Database');

module.exports = {
    update: function (data, done) {
        data.updatedAt = moment().toDate();
        db.connect('bhajans', function (error, client, bhajans) {
            if (error) return done(error);

            bhajans.findOne({bhajan_id: data.bhajan_id}, function (error, bhajan) {
                if (error) return done(error);
                if (!bhajan) return done(new Error('No bhajan found to update.'));

                delete bhajan._id;
                var updated = _.extend(bhajan, data);
                bhajans.update({bhajan_id: data.bhajan_id}, {$set: updated}, function (error, result) {
                    if (error) return done(error);
                    client.close();
                    return done(null, updated);
                });
            });
        });
    },

    /*
    * Find One: accepts JSON filter {field: value}, callback. Returns
    * result as JS object if found, else error.
    */
    findOne: function (data, callback) {
        if (_.isFunction(callback)) {
            db.connect('bhajans', function (error, client, bhajans) {
                if (error) return callback(error);
                bhajans.findOne(data, function (error, result) {
                    client.close();
                    if (error) return callback(error);
                    if (result) return callback(null, result);

                    // Return 404 error if no result found.
                    error = new Error();
                    error.status = 404;
                    error.message = 'This bhajan does not exist anymore.';
                    return callback(error);
                });
            });
        } else {
            throw {
                name: 'CallbackError',
                message: 'Callback not provided.'
            };
        }
    },
    /*
    * Search: accepts JSON query {field: regex}, callback. Returns
    * result as JS array (empty if no results).
    */
    search: function (data, callback) {
        if (_.isFunction(callback)) {
            var find = {approved: true};
            Object.keys(data).forEach(function (val, idx) {
                if (val !== 'approved') find[val] = {$regex: data[val], $options: 'i'};
                else find[val] = data[val];
            });
            db.connect('bhajans', function (error, client, bhajans) {
                if (error) return callback(error);
                bhajans.find(find, {_id: 0}).sort({title: 1}).toArray(function (error, result) {
                    client.close();
                    if (error) return callback(error);
                    return callback(null, result);
                });
            });
        } else {
            throw {
                name: 'CallbackError',
                message: 'Callback not provided'
            };
        }
    }
};
