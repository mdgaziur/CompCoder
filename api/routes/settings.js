const expressRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');

const Settings = expressRouter.all('/', async (req, res) => {
    let uuid = await jwt.verify(req.cookies.accessToken || '', process.env.JWT_SECRET_TOKEN, (err, uuid) => {
        if (err) return false;
        return uuid.uuid;
    });
    if(!uuid) {
        res.redirect('/login?return=/settings');
    }
    else {
        const user = await userSchema.findOne({ uuid: uuid });
        res.render('settings', { user: user });
    }
});

module.exports = Settings;