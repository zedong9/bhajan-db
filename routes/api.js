var Bhajan = require('../models').Bhajan;

module.exports = {
    findOne: function (req, res) {
        res.json(req.body.bhajan);
    },
    search: function (req, res) {
        Bhajan.search({title: req.params.search}, function (error, result) {
            if (error) {
                res.send(error);
            } else {
                res.json(result);
            }
        });
    }
};
