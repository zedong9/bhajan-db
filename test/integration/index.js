var Browser = require('zombie');
var expect = require('chai').expect;
var http = require('http');
var request = require('superagent');
var uuid = require('node-uuid');

var app = require('../../app');
var browser = new Browser(),
    port = 3030,
    address;

describe('Homepage', function () {
    before(function (done) {
        app.set('port', port);
        address = 'http://localhost:' + app.get('port');
        http.createServer(app).listen(app.get('port'), done);
    });

    beforeEach(function (done) {
        browser.visit(address).then(done, done);
    });

    describe('Global layout', function () {
        describe('navbar', function () {
            it('should have a link to the project homepage', function () {
                expect(browser.link('.navbar-brand').href).to.equal(address + '/');
            });
        });

        describe('navbar search', function () {
            it('should not work if query is blank.', function (done) {
                browser.pressButton('#navbar-search', function () {
                    expect(browser.location.pathname).to.equal('/');
                    expect(browser.location.search).to.equal('');
                    done();
                });
            });
        });

        describe('footer', function () {
            it('should have an about link to repository URL.', function () {
                expect(browser.link('About').href).to.equal(app.locals.repo);
            });

            it('should have the project version number.', function () {
                expect(browser.text()).to.contain(app.locals.version);
            });
        });
    });

    it('should load the homepage.', function () {
        expect(browser.location.pathname).to.equal('/');
    });

    it('should have the project title as an h1 tag', function () {
        expect(browser.text('h1')).to.equal(app.locals.project);
    });

    describe('Search', function () {
        describe('by title', function () {
            it('should redirect to search results page.', function () {
                browser.fill('#query', 'sairam').click('#search_title');
                expect(browser.location.pathname).to.equal('/search');
                expect(browser.location.search).to.equal('?title=sairam');
            });

            it('should not work if query is blank.', function () {
                browser.click('#search_title');
                expect(browser.location.pathname).to.equal('/');
                expect(browser.location.search).to.equal('');
            });
        });

        describe('by lyrics', function () {
            it('should redirect to search results page.', function () {
                browser.fill('#query', 'sairam').click('#search_lyrics');
                expect(browser.location.pathname).to.equal('/search');
                expect(browser.location.search).to.equal('?lyrics=sairam');
            });

            it('should not work if query is blank.', function () {
                browser.click('#search_lyrics');
                expect(browser.location.pathname).to.equal('/');
                expect(browser.location.search).to.equal('');
            });
        });
    });

    describe('Errors', function () {
        it('renders 404 view if page is not found.', function (done) {
            request.get(address + '/' + uuid.v4()).end(function (res) {
                expect(res.status).to.equal(404);
                expect(res.text).to.contain('Looks like this page doesn\'t exist anymore.');
                done();
            });
        });

        it('renders 500 view for all other errors.', function (done) {
            request.get(address + '/error').end(function (res) {
                expect(res.status).to.equal(500);
                expect(res.text).to.contain('Looks like something went terribly wrong.');
                done();
            });
        });
    });
});

