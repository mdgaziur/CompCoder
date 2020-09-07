const expressRouter = require('express').Router();

const Logout = expressRouter.all('/', async (req, res) => {
    req.session.accessToken = null;
    res.redirect('/');
});

module.exports = Logout