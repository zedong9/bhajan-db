var hash = require('password-hash');
var db = require('./Database');

module.exports = {
    validate: function (username, password, done) {
        db.connect('users', function (error, client, users) {
            users.findOne({username: username}, function (error, user) {
                client.close();
                if (error) return done(error);
                if (!user) return done(null, false, {message: 'Incorrect username.'});
                if (hash.verify(password, user.password)) return done(null, user);
                return done(null, false, {message: 'Incorrect password.'});
            });
        });
    },
    serialize: function (user, done) {
        done(null, user.username);
    },
    deserialize: function (username, done) {
        db.connect('users', function (error, client, users) {
            users.findOne({username: username}, function (error, user) {
                client.close();
                done(error, user);
            });
        });
    }
};
