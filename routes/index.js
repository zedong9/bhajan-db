var bhajan = require('./bhajan');

module.exports = {
    index: function(req, res) {
        res.locals.title = 'Home';
        res.render('index');
    },
    bhajan: bhajan
};
