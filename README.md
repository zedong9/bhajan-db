BhajanDB [![Build Status] (https://travis-ci.org/sgunturi/bhajan-db.png?branch=master)](https://travis-ci.org/sgunturi/bhajan-db)
=========

A project for making finding and sharing new bhajans easier.

## Installation

After forking and cloning the repo, run:
```sh
cd bhajan-db
npm install
```

Decrypt database credentials:
```sh
make decrypt_creds
Contact sai.gunturi@gmail.com for the password.
openssl cast5-cbc -d -in models/db-credentials.json.cast5 -out models/db-credentials.json
enter cast5-cbc decryption password:
```
After entering the password, you should be good to go. Fire up the app:

```sh
npm start

> node app.js
Express server listening on port 3000
```
BhajanDB should be running at localhost:3000!

## Tests

To run tests:
```sh
npm test
```
