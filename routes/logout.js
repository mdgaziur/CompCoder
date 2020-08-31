const expressRouter = require('express').Router();

const Login = expressRouter.all('/', async (req, res) => {
    req.session.accessToken = null;
    res.render('unregistered');
});

module.exports = Login