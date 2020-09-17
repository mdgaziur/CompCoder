const session_config = require('../session_config');

const expressRouter = require('express').Router();

const Logout = expressRouter.all('/', async (req, res) => {
    res.cookie('accessToken', null, session_config);
    res.redirect('/');
});

module.exports = Logout;