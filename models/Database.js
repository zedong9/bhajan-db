var mongodb = require('mongodb');
var _ = require('underscore');


var mongoURI;

if (process.env.TRAVIS_SECURE_ENV_VARS) {
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
    connect: function (collection_name, callback) {
        if (!_.isFunction(callback)) {
            callback(new Error('callback is not a function.'));
            return;
        } else {
            mongodb.MongoClient.connect(mongoURI, function (error, database) {
                if (error) {
                    callback(error);
                    return;
                } else {
                    var collection = new mongodb.Collection(database, collection_name);
                    callback(null, database, collection);
                }
            });
        }
    }
};
