const expressRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');

const Drafts = expressRouter.all('/', async (req, res) => {
    let uuid = await jwt.verify(req.session.accessToken, process.env.JWT_SECRET_TOKEN, (err, uuid) => {
        if (err) return false;
        return uuid.uuid;
    });
    if(!uuid) {
        res.redirect('/login?return=/settings/password');
    }
    else {

    }
});

module.exports = Drafts;