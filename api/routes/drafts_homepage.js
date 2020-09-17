const expressRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const problemSchema = require('../models/problem');

const Drafts = expressRouter.all('/', async (req, res) => {
    let uuid = await jwt.verify(req.cookie.accessToken, process.env.JWT_SECRET_TOKEN, (err, uuid) => {
        if (err) return false;
        return uuid.uuid;
    });
    if(!uuid) {
        res.redirect('/login?return=/drafts');
    }
    else {
        let user = await userSchema.findOne({ uuid: uuid });
        let user_problems = await problemSchema.find({ creator: user });
        res.render('cb_drafts', { user: user });
    }
});

module.exports = Drafts;