var settings = require('./settings');
var session = require('express-session');
var SessionStore = require('express-mysql-session');

var session = session({
    name: 'identity',
    secret: 'health',
    resave: false,
    saveUninitialized: true,
    store: new SessionStore(settings),
    cookie:{
        maxAge: 1000 * 60 * 30
    }
})

module.exports = session;