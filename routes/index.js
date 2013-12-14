var bhajan = require('./bhajan');
var api = require('./api');

module.exports = {
    index: function(req, res) {
        res.locals.title = 'Home';
        res.render('index');
    },
    bhajan: bhajan,
    api: api
};
