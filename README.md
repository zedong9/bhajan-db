BhajanDB [![Build Status] (https://travis-ci.org/sgunturi/bhajan-db.png?branch=master)](https://travis-ci.org/sgunturi/bhajan-db)
=========

A project for making finding and sharing new Sai bhajans easier by providing:

* users with a website to search for bhajans and upload new ones.
* developers with a read-only API for creating their own bhajans database.

## Installation

After forking and cloning the repo, run:
```sh
cd bhajan-db
npm install
```

If you have [Grunt](http://gruntjs.com/getting-started) installed, run:
```sh
grunt init
```

Decrypt database credentials:
```sh
make decrypt_creds
enter cast5-cbc decryption password:
```
After entering the password, you should be good to go. Fire up the app:

```sh
npm start

> node app.js
Express server listening on port 3000
```
BhajanDB should be running at localhost:3000.

## Contributing

* Make sure you're on the latest version of master.
* Develop in a topic branch, not master.
* Lint and test with `grunt` command.
* Squash your commits before creating a pull request.

## Tests

To run tests:
```sh
npm test
```
