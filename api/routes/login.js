const expressRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const bcrypt = require('bcrypt');
const { options } = require('./home');
const session_config = require('../session_config');

const Login = expressRouter.all('/', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let uuid = await jwt.verify(req.cookies.accessToken || '', process.env.JWT_SECRET_TOKEN, (err, uuid) => {
        if (err) return false;
        return uuid.uuid;
    });
    if(uuid) {
        res.redirect('/');
    }
    else if(!email && !password)
    {
        res.render('login');
    }
    else if(!email || !password) {
        res.render('login', {Failed: "Fill in all the fields to proceed."});
    }
    else {
        let user = await userSchema.findOne({ email: email });
        if(!user) {
            res.render('login', { Failed: "User doen't exist. Maybe you don't have an account." });
        }
        else {
            const salted_password = user.password;
            await bcrypt.compare(password, salted_password, (err, passwordMatched) => {
                if(err) res.render('login', { Failed: "Wrong Password!" });
                if(passwordMatched) {
                    if(req.body.remember) {
                        accessToken = jwt.sign({ uuid : user.uuid }, process.env.JWT_SECRET_TOKEN);
                        session_config.maxAge = undefined;
                    }
                    else {
                        accessToken = jwt.sign({ uuid : user.uuid }, process.env.JWT_SECRET_TOKEN, {
                            expiresIn: '7d'
                        });
                    }
                    res.cookie('accessToken', accessToken, session_config);
                    if(req.query.return) {
                        res.redirect(req.query.return);
                    }
                    else {
                        res.redirect('/');
                    }
                }
                else {
                    res.render('login', { Failed: "Wrong Password!" });
                }
            });
        }
    }
});

module.exports = Login;