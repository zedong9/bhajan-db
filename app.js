// Load node modules.
var express = require('express');
var http = require('http');
var moment = require('moment');
var path = require('path');

// Load route functions.
var routes = require('./routes');
var api = require('./routes/api');

// Load models.
var Bhajan = require('./models/Bhajan');

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
app.use(app.router); // use specified route functions.
app.use(express.logger('dev'));
app.use(require('less-middleware')({ src: __dirname + '/public' })); // use LESS to render CSS.
app.use(express.static(path.join(__dirname, 'public'))); // Look in public directory if no other routes match.

// If running in development, use express's error handler function.
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
} else if ('production' === app.get('env')) {
    app.use(function (err, req, res, next) {
        console.log(err);
        res.status(500).render('500');
    });
}

// If param 'bhajan_id' is present in the route,
// find bhajan with that id and attach it to req.body.
app.param('bhajan_id', function (req, res, next, bhajan_id) {
    Bhajan.findOne({bhajan_id: bhajan_id}, function (err, bhajan) {
        if (err && err.status === 404) {
            res.status(404).render('404');
            console.log(err);
        } else if (err) {
            next(err);
        } else {
            req.body.bhajan = bhajan;
            next();
        }
    });
});

// Add global config variables.
app.locals({
    author: 'teamswami',
    project: 'BhajanDB',
    year: moment().format('YYYY'),
});

// Route for homepage.
app.get('/', routes.index);

// API routes for search & findOne methods.
app.get('/search/:search', api.search);
app.get('/bhajan/:bhajan_id', api.findOne);

// Error route to test error handling.
app.get('/error', function (req, res, next) {
    return next(new Error('An error has been thrown.'));
});

// Handle all other routes with 404.
app.get('*', function (req, res, next) {
    res.status(404).render('404');
});

// If app.js is started by itself, start the server.
if (!module.parent) {
    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });
// Otherwise (for use in test suites), export app variable.
} else {
    module.exports = app;
}
