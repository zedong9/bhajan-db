var models = require('../models');
var Bhajan = models.Bhajan;

module.exports = {
    findOne: function (req, res) {
        res.json(req.body.bhajan);
    },

    search: function (req, res, next) {
        Bhajan.search({lyrics: req.params.search}, function (error, result) {
            if (error) next(error);
            else res.json(result);
        });
    },

    findAll: function (req, res, next) {
        Bhajan.search({
            test: {$exists: 0},
            approved: {$exists: 1}
        }, function (error, result) {
            if (error) return next(error);
            else res.json(result);
        });
    }
};
