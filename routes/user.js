var passport = require('passport');

module.exports = {
    login: function (req, res) {
        res.locals({title: 'Login', flash: req.flash()});
        res.render('login');
    },
    logout: function (req, res) {
        req.logout();
        res.redirect('/');
    },
    authenticate: passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
};
