var mongodb = require('mongodb');
var _ = require('underscore');

var mongoURI;

if (process.env.TRAVIS_SECURE_ENV_VARS) {
    mongoURI = 'mongodb://127.0.0.1:27017/test';
} else if (process.env.NODE_ENV === 'production') {
    if (!process.env.DB_USER || !process.env.DB_SECRET) throw new Error('Database credentials not provided.');
    mongoURI = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_SECRET + '@paulo.mongohq.com:10080/bhajan-db';
} else {
    var credentials = require('./db-credentials.json');
    mongoURI = 'mongodb://' + credentials.username + ':' + credentials.password + '@paulo.mongohq.com:10080/bhajan-db';
}

module.exports = {
    /*
    * Connect: Accepts collection name, callback. Returns
    * server connection and requested MongoDB Collection.
    */
    connect: function (collection_name, next) {
        if (!_.isFunction(next)) return new Error('Callback is not a function.');
        mongodb.MongoClient.connect(mongoURI, function (error, database) {
            if (error) return next(error);

            var collection = new mongodb.Collection(database, collection_name);
            next(null, database, collection);
        });
    }
};
