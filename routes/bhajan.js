var models = require('../models');
var Bhajan = models.Bhajan;

module.exports = {
    findOne: function (req, res) {
        var bhajan = req.body.bhajan;
        bhajan.lyrics = bhajan.lyrics.replace(/\\n/g, '<br>');
        res.locals.flash = req.flash();
        res.render('bhajan', bhajan);
    },

    findAll: function (req, res, next) {
        Bhajan.search({approved: true, test: {$exists: 0}}, function (error, result) {
            if (error) return next(error);
            res.render('browse', {title: 'Browse All', result: result});
        });
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
        var bhajan = req.body.bhajan;
        bhajan.lyrics = bhajan.lyrics.replace(/\\n/g, '&#13;');
        res.locals.title = 'Edit';
        res.render('edit', {bhajan: bhajan});
    },

    update: function (req, res, next) {
        Bhajan.update(req.body, function (error, result) {
            if (error) return next(error);
            req.flash('success', 'The bhajan has been updated.');
            res.redirect('/bhajan/' + result.bhajan_id);
        });
    },

    create: function (req, res, next) {
        Bhajan.create(req.body, function (error, result) {
            if (error) return next(error);
            req.flash('success', 'Your bhajan has been submitted for approval.');
            res.redirect('/');
        });
    },

    review: function (req, res, next) {
        Bhajan.search({approved: false}, function (error, result) {
            if (error) return next(error);
            res.locals.title = 'Review';
            res.render('review', {result: result});
        });
    }
};
