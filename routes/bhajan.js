var models = require('../models');
var Bhajan = models.Bhajan;

module.exports = {
    findOne: function (req, res) {
        var bhajan = req.body.bhajan;
        bhajan.lyrics = bhajan.lyrics.replace(/\\n/g, '<br>');
        res.render('bhajan', bhajan);
    },

    search: function (req, res, next) {
        Bhajan.search(req.query, function (error, result) {
            if (error) return next(error);
            var search = (req.query.title || req.query.lyrics || '');
            res.locals.result = result;
            res.locals.search = search;
            res.locals.title = 'Search results for "' + search + '"';
            res.render('search');
        });
    },

    edit: function (req, res) {
        if (!req.isAuthenticated()) return res.redirect('/login');
        var bhajan = req.body.bhajan;
        bhajan.lyrics = bhajan.lyrics.replace(/\\n/g, '&#13;');
        res.locals.title = 'Edit';
        res.render('edit', {bhajan: bhajan});
    },

    update: function (req, res, next) {
        Bhajan.update(req.body, function (error, result) {
            if (error) return next(error);
            res.redirect('/bhajan/' + result.bhajan_id);
        });
    }
};
