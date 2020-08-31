//Grab the data from .env
require('dotenv').config();

const session_config = {
    cookieName: 'session',
    secret: process.env.SECRET_KEY,
    useUninitialized: false,
    httpOnly: true,
    maxAge: 86400000,
    sameSite: true,
    resave: false,
    saveUninitialized: false
}

module.exports = session_config;