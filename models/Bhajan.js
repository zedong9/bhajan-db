var moment = require('moment');
var mongodb = require('mongodb');
var shortid = require('shortid');
var _ = require('underscore');
var _str = require('underscore.string');

var db = require('./Database');
var logger = require('../log');

module.exports = {
    /*
    * Create: accepts bhajan data, callback. Validates, sanitizes, and inserts
    * object to database and calls back inserted object.
    */
    create: function (data, done) {
        logger.debug('Create method called.');
        logger.trace('Data: %j', data);

        if (!_.isFunction(done)) throw new Error('Callback not provided.');
        if (!data.lyrics) return done(new Error('Lyrics not provided.'));
        data.title = _str.titleize(data.title);
        data.lyrics = _.chain(data.lyrics.split(/\r\n/))
            .map(function (val) {
                return _str.titleize(val);
            }).reduceRight(function (a, b) {
                return _str.join('\\n', b, a);
            }).value();
        data.bhajan_id = shortid();
        data.createdAt = moment().toDate();
        data.approved = false;

        logger.debug('Create data sanitized.');
        logger.trace('Data: %j', data);

        db.connect('bhajans', function (error, client, bhajans) {
            bhajans.insert(data, function (error, result) {
                client.close();
                if (error) return done(error);
                var bhajan = _.first(result);

                logger.debug('Bhajan created - %s', bhajan.bhajan_id);
                logger.trace('Data: %j', bhajan);

                done(null, bhajan);
            });
        });
    },
    /*
    * Update: accepts bhajan data, callback. Validates, sanitizes, and updates
    * object in database and calls back updated object.
    */
    update: function (data, done) {
        logger.debug('Update method called.');
        logger.trace('Data: %j', data);


        if (!_.isFunction(done)) throw new Error('Callback not provided.');
        data.approved = (data.approved === 'true');
        data.updatedAt = moment().toDate();
        if (data.lyrics) data.lyrics = data.lyrics.replace(/\r\n/g, '\\n');

        logger.debug('Update data sanitized.');
        logger.trace('Data: %j', data);

        db.connect('bhajans', function (error, client, bhajans) {
            if (error) return done(error);

            bhajans.findOne({bhajan_id: data.bhajan_id}, function (error, bhajan) {
                if (error) return done(error);
                if (!bhajan) return done(new Error('No bhajan found to update.'));

                delete bhajan._id;
                var updated = _.extend(bhajan, data);

                logger.debug('Bhajan data extended locally.');
                logger.trace('Data: %j', updated);

                bhajans.update({bhajan_id: data.bhajan_id}, {$set: updated}, function (error, result) {
                    if (error) return done(error);
                    client.close();

                    logger.debug('Bhajan data updated.');
                    logger.trace('Data: %j', updated);

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
        logger.debug('findOne method called.');
        logger.trace('Data: %j', data);

        if (!_.isFunction(done)) throw new Error('Callback not provided.');

        db.connect('bhajans', function (error, client, bhajans) {
            if (error) return done(error);
            bhajans.findOne(data, function (error, result) {
                client.close();
                if (error) return done(error);

                logger.debug('findOne query complete.');
                logger.trace('Data: %j', result);

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
        logger.debug('Search method called.');
        logger.trace('Data: %j', data);

        if (!_.isFunction(done)) throw new Error('Callback not provided.');
        var find = {approved: true};
        Object.keys(data).forEach(function (val, idx) {
            if (val !== 'approved' && val !== 'test') find[val] = {$regex: data[val], $options: 'i'};
            else find[val] = data[val];
        });

        logger.debug('Search query assembled.');
        logger.trace('Data: %j', find);

        db.connect('bhajans', function (error, client, bhajans) {
            if (error) return done(error);
            bhajans.find(find, {_id: 0}).sort({title: 1}).toArray(function (error, result) {
                client.close();

                logger.debug('Search query complete with %d results.', result.length);
                logger.trace('Data: %j', result);

                if (error) return done(error);
                return done(null, result);
            });
        });
    },

    destroy: function (bhajan_id, done) {
        logger.debug('Destroy method called.');
        logger.trace('Bhajan: %s', bhajan_id);

        if (!_.isFunction(done)) throw new Error('Callback not provided.');

        db.connect('bhajans', function (error, client, bhajans) {
            if (error) return done(error);
            bhajans.remove({bhajan_id: bhajan_id}, function (error, result) {
                client.close();

                logger.debug('Deleted bhajan %s', bhajan_id);
                logger.trace('Data: %j', result);

                if (error) return done(error);
                return done(null, result);
            });
        });
    }
};
