var models = require('../models');
var Bhajan = models.Bhajan;

function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>';
    return (str + '').replace(/\\n/g, '<br>');
}

module.exports = {
    findOne: function (req, res) {
        var bhajan = req.body.bhajan;
        bhajan.lyrics = nl2br(bhajan.lyrics); // Replace newline characters with <br>.
        res.render('bhajan', bhajan);
    },

    search: function (req, res) {
        Bhajan.search(req.query, function (error, result) {
            if (error) res.send(error);
            else {
                var search = (req.query.title || req.query.lyrics || '');
                res.locals.result = result;
                res.locals.search = search;
                res.locals.title = 'Search results for "' + search + '"';
                res.render('search');
            }
        });
    }
};
