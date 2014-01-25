var mongodb = require('mongodb');
var _ = require('underscore');

var logger = require('../log')('info');
var mongoURI;

if (process.env.TRAVIS_SECURE_ENV_VARS) {
    logger.debug('Using test database.');
    mongoURI = 'mongodb://127.0.0.1:27017/test';
} else if (process.env.NODE_ENV === 'production') {
    logger.debug('Using production database.');
    if (!process.env.DB_USER || !process.env.DB_SECRET) throw new Error('Database credentials not provided.');
    mongoURI = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_SECRET + '@paulo.mongohq.com:10080/bhajan-db';
} else {
    logger.debug('Using development database.');
    var credentials = require('./db-credentials.json');
    mongoURI = 'mongodb://' + credentials.username + ':' + credentials.password + '@alex.mongohq.com:10016/bhajan-dev';
}

module.exports = {
    /*
    * Connect: Accepts collection name, callback. Returns
    * server connection and requested MongoDB Collection.
    */
    connect: function (collection_name, next) {
        logger.trace('Connecting to %s collection.', collection_name);
        if (!_.isFunction(next)) return new Error('Callback is not a function.');
        mongodb.MongoClient.connect(mongoURI, function (error, database) {
            if (error) return next(error);

            logger.trace('Connection to %s collection successful.', collection_name);
            var collection = new mongodb.Collection(database, collection_name);
            next(null, database, collection);
        });
    }
};
