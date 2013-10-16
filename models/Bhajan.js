var mongodb = require('mongodb');
var _ = require('underscore');

var Db = require('./Database');

module.exports = {
    /*
    * Find One: accepts JSON filter {field: value}, callback. Returns
    * result as JS object if found, else error.
    */
    findOne: function (data, callback) {
        if (_.isFunction(callback)) {
            Db.connect('bhajans', function (client, bhajans) {
                bhajans.findOne(data, function (error, result) {
                    client.close();
                    if (error) {
                        callback(error);
                        return;
                    } else {
                        if (null !== result) {
                            callback(null, result);
                            return;
                        } else {
                            callback(new Error('This bhajan does not exist anymore.'));
                            return;
                        }
                    }
                });
            });
        } else {
            throw {
                name: 'CallbackError',
                message: 'Callback not provided.'
            }
        }
    },
    /*
    * Search: accepts JSON query {field: regex}, callback. Returns
    * result as JS array (empty if no results).
    */
    search: function (data, callback) {
        if (_.isFunction(callback)) {
            var findObject = {};
            var keys = Object.keys(data);
            keys.forEach(function (val, idx) {
                findObject[val] = {$regex: data[val], $options: 'i'};
            });
            Db.connect('bhajans', function (client, bhajans) {
                bhajans.find(findObject).toArray(function (error, result) {
                    client.close();
                    if (error) {
                        callback(error);
                        return;
                    } else {
                        callback(null, result)
                    }
                });
            });
        } else {
            throw {
                name: 'CallbackError',
                message: 'Callback not provided'
            }
        }
    }
};
