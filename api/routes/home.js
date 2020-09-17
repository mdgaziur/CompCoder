const expressRouter = require('express').Router();
const userSchema = require('../models/user');
const jwt = require('jsonwebtoken');

const Home = expressRouter.get('/', async (req, res) => {
    let uuid = await jwt.verify(req.cookies.accessToken || '', process.env.JWT_SECRET_TOKEN, (err, uuid) => {
        if (err) return false;
        return uuid.uuid;
    });
    if(uuid) {
        const user = await userSchema.findOne({ uuid: uuid });
        res.render('index', { user: user });
        res.end();
    }
    else {
        res.render('unregistered');
    }
});

module.exports = Home;