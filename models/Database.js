var moment = require('moment');
var mongodb = require('mongodb');
var _ = require('underscore');

var mongoServer = 'localhost';
var environment = 'development';

module.exports = {
    /*
    * Connect: Accepts collection name, callback. Returns
    * server connection and requested MongoDB Collection.
    */
    connect: function (collection_name, callback) {
        if (!_.isFunction(callback)) {
            return callback(new Error('callback is not a function.'));
        } else {
            var server = new mongodb.Server(mongoServer, 27017, {auto_reconnect: true, safe: true});
            new mongodb.Db(environment, server, {safe: true}).open(function (error, client) {
                if (error) throw error;

                var collection = new mongodb.Collection(client, collection_name);
                callback(client, collection);
            });
        }
    }
};
