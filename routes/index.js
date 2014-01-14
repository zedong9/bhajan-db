module.exports = {
    index: function (req, res) {
        res.locals.title = 'Home';
        res.locals.flash = req.flash();
        res.render('index');
    },
    bhajan: require('./bhajan'),
    api: require('./api'),
    user: require('./user')
};
