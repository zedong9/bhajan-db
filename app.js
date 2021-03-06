// Load node modules.
var express = require('express');
var flash = require('connect-flash');
var http = require('http');
var moment = require('moment');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');
var stylus = require('stylus');

// Load route functions.
var routes = require('./routes');
var middleware = require('./middleware');

// Load models.
var models = require('./models');
var Bhajan = models.Bhajan;
var quote = models.Quote();
var User = models.User;

// Load app helpers.
var info = require('./package.json');
var logger = require('./log')('info');

// Initialize app.
var app = express();

// Configure app for all environments.
// These middleware functions are processed in the order that they are included.
logger.debug('Starting application middleware...');
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views'); // set views directory.
app.set('view engine', 'jade'); // use jade to render views.
app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({secret: 'SECRET'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(middleware.loadUser);
app.use(function (req, res, next) {
    if (['stylesheets', 'img'].indexOf(req.path.split('/')[1]) === -1) logger.info(req.method, req.originalUrl);
    logger.trace(req.method, req.originalUrl);
    next();
});
app.use(app.router);
app.use(stylus.middleware({
    src: __dirname + '/resources/stylesheets/',
    dest: __dirname + '/public/stylesheets/',
    compile: function (str, path) {
        return stylus(str)
            .set('filename', path)
            .set('compress', true)
            .use(require('nib')())
            .import('nib');
    }
}));
app.use(express.static(path.join(__dirname, 'public'))); // Look in public directory if no other routes match.
app.use(function (req, res, next) {res.status(404).render('404');});
app.use(middleware.errorHandler);
logger.debug('Application middleware loaded.');

passport.use(new LocalStrategy(User.validate));
passport.serializeUser(User.serialize);
passport.deserializeUser(User.deserialize);

app.configure('development', function () {
    // Error route to test error handling.
    app.get('/error', function (req, res, next) {
        return next(new Error('A test error has been thrown.'));
    });

    app.get('/flash', function (req, res) {
        req.flash('success', 'This is a flash message.');
        res.redirect('/');
    });
});

// If param 'bhajan_id' is present in the route,
// find bhajan with that id and attach it to req.body.
app.param('bhajan_id', function (req, res, next, bhajan_id) {
    Bhajan.findOne({bhajan_id: bhajan_id}, function (err, bhajan) {
        if (err) return next(err);
        req.body.bhajan = bhajan;
        next();
    });
});

// Add global config variables.
app.locals({
    author: 'teamswami',
    project: 'BhajanDB',
    year: moment().format('YYYY'),
    version: info.version,
    repo: info.repository.url,
    quote: quote
});

// Route for homepage.
app.get('/', routes.index);

// Routes for bhajan CRUD operations.
app.get('/bhajan/:bhajan_id', routes.bhajan.findOne);
app.get('/search', routes.bhajan.search);
app.get('/browse', routes.bhajan.findAll);

app.get('/create', function (req, res) { res.render('create', {title: 'Add Bhajan'}); });
app.post('/bhajan', routes.bhajan.create);
app.delete('/bhajan/:bhajan_id', middleware.requireAuthentication, routes.bhajan.delete);

app.get('/review', middleware.requireAuthentication, routes.bhajan.review);
app.get('/edit/:bhajan_id', middleware.requireAuthentication, routes.bhajan.edit);
app.put('/edit', middleware.requireAuthentication, routes.bhajan.update);

// API routes to send data as JSON.
app.get('/api/search/:search', routes.api.search);
app.get('/api/bhajan', routes.api.findAll);
app.get('/api/bhajan/:bhajan_id', routes.api.findOne);

// Routes to manage authentication states.
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);
app.get('/logout', routes.user.logout);

// If app.js is started by itself, start the server.
if (!module.parent) {
    http.createServer(app).listen(app.get('port'), function(){
        logger.info('Express server listening on port ' + app.get('port') + ' in ' + app.get('env') + ' mode.');
        logger.info('"%s" -- swami', quote);
        logger.info();
    });
// Otherwise (for use in test suites), export app variable.
} else module.exports = app;
