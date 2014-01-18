var models = require('../models');
var Bhajan = models.Bhajan;
var logger = require('../log');

module.exports = {
    findOne: function (req, res) {
        logger.debug('API findOne request: %s', req.body.bhajan.bhajan_id);
        res.json(req.body.bhajan);
    },

    search: function (req, res, next) {
        logger.debug('API search request: %s', req.params.search);
        Bhajan.search({lyrics: req.params.search}, function (error, result) {
            if (error) next(error);
            else res.json(result);
        });
    },

    findAll: function (req, res, next) {
        logger.debug('API findAll request.');
        Bhajan.search({
            test: {$exists: 0},
            approved: {$exists: 1}
        }, function (error, result) {
            if (error) return next(error);
            else res.json(result);
        });
    }
};
