const expressRouter = require('express').Router();

const PasswordReset = expressRouter.get('/', (req, res) => {
    res.render('password_reset');
    res.end();
});

module.exports = PasswordReset;