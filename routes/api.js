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
        Bhajan.search({}, function (error, result) {
            if (error) next(error);
            else res.json(result);
        });
    }
};
