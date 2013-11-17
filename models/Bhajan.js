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
            Db.connect('bhajans', function (error, client, bhajans) {
                if (error) {
                    callback (error);
                    return;
                } else {
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
                                var error = new Error();
                                error.status = 404;
                                error.message = 'This bhajan does not exist anymore.';
                                callback(error);
                                return;
                            }
                        }
                    });
                }
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
            Db.connect('bhajans', function (error, client, bhajans) {
                if (error) {
                    callback (error);
                    return;
                } else {
                    bhajans.find(findObject).sort({title: 1}).toArray(function (error, result) {
                        client.close();
                        if (error) {
                            callback(error);
                            return;
                        } else {
                            callback(null, result)
                        }
                    });
                }
            });
        } else {
            throw {
                name: 'CallbackError',
                message: 'Callback not provided'
            }
        }
    }
};