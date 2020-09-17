//Grab the data from .env
require('dotenv').config();

const session_config = {
    cookieName: 'cb',
    secret: process.env.SECRET_KEY,
    useUninitialized: false,
    httpOnly: true,
    sameSite: true,
    resave: false,
    saveUninitialized: false
};

module.exports = session_config;