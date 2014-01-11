// Load node modules.
var express = require('express');
var http = require('http');
var moment = require('moment');
var path = require('path');

// Load route functions.
var routes = require('./routes');

// Load models.
var models = require('./models');
var Bhajan = models.Bhajan;
var Quote = models.Quote;

// Load app info.
var info = require('./package.json');

// Initialize app.
var app = express();

// Configure app for all environments.
// These middleware functions are processed in the order that they are included.
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views'); // set views directory.
app.set('view engine', 'jade'); // use jade to render views.
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.logger('dev'));
app.use(app.router); // use specified route functions.
app.use(require('less-middleware')({ src: __dirname + '/public' })); // use LESS to render CSS.
app.use(express.static(path.join(__dirname, 'public'))); // Look in public directory if no other routes match.

app.configure('development', function () {
    // Error route to test error handling.
    app.get('/error', function (req, res, next) {
        return next(new Error('A test error has been thrown.'));
    });
    // Use Express's error handler.
    app.use(express.errorHandler());
});

// Custom error handling for production.
app.configure('production', function () {
    app.use(function (err, req, res, next) {
        if (err.status === 404) res.status(404).render('404');
        else res.status(500).render('500');
        console.log(err);
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
    quote: Quote()
});

// Route for homepage.
app.get('/', routes.index);

// Routes for search & individual bhajan views.
app.get('/search', routes.bhajan.search);
app.get('/bhajan/:bhajan_id', routes.bhajan.findOne);

// API routes to send data as JSON.
app.get('/api/search/:search', routes.api.search);
app.get('/api/bhajan', routes.api.findAll);
app.get('/api/bhajan/:bhajan_id', routes.api.findOne);

// Handle all other routes with 404.
app.get('*', function (req, res, next) {
    res.status(404).render('404');
});

// If app.js is started by itself, start the server.
if (!module.parent) {
    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port') + ' in ' + app.get('env') + ' mode.');
    });
// Otherwise (for use in test suites), export app variable.
} else {
    module.exports = app;
}
