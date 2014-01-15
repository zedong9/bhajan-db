module.exports = {
    requireAuthentication: function (req, res, next) {
        if (!req.isAuthenticated()) return res.redirect('/login');
        next();
    },
    loadUser: function (req, res, next) {
        if (req.isAuthenticated()) res.locals.username = req.user.username;
        next();
    },
    errorHandler: function (err, req, res, next) {
        if (err.status === 404) res.status(404).render('404');
        else res.status(500).render('500');
        console.log(err);
    }
};
