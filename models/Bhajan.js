var moment = require('moment');
var mongodb = require('mongodb');
var _ = require('underscore');

var db = require('./Database');

module.exports = {
    update: function (data, done) {
        if (!_.isFunction(done)) throw new Error('Callback not provided.');
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
    findOne: function (data, done) {
        if (!_.isFunction(done)) throw new Error('Callback not provided.');
        db.connect('bhajans', function (error, client, bhajans) {
            if (error) return done(error);
            bhajans.findOne(data, function (error, result) {
                client.close();
                if (error) return done(error);
                if (result) return done(null, result);

                // Return 404 error if no result found.
                error = new Error();
                error.status = 404;
                error.message = 'This bhajan does not exist.';
                return done(error);
            });
        });
    },
    /*
    * Search: accepts JSON query {field: regex}, callback. Returns
    * result as JS array (empty if no results).
    */
    search: function (data, done) {
        if (!_.isFunction(done)) throw new Error('Callback not provided.');
        var find = {approved: true};
        Object.keys(data).forEach(function (val, idx) {
            if (val !== 'approved') find[val] = {$regex: data[val], $options: 'i'};
            else find[val] = data[val];
        });
        db.connect('bhajans', function (error, client, bhajans) {
            if (error) return done(error);
            bhajans.find(find, {_id: 0}).sort({title: 1}).toArray(function (error, result) {
                client.close();
                if (error) return done(error);
                return done(null, result);
            });
        });
    }
};
