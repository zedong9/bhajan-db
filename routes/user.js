var passport = require('passport');

module.exports = {
    login: function (req, res) {
        if (req.user) return res.redirect('/review');
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
        failureRedirect: '/login',
        failureFlash: true
    })
};
