var passport = require('passport');

module.exports = {
    login: function (req, res) {
        res.locals.title = 'Login';
        res.locals.flash = {warning: req.flash('error')};
        res.render('login');
    },
    logout: function (req, res) {
        req.logout();
        req.flash('warning', 'Successfully logged out.');
        res.redirect('/');
    },
    authenticate: passport.authenticate('local', {
        successRedirect: '/review',
        successFlash: 'Logged in.',
        failureRedirect: '/login',
        failureFlash: true
    })
};
