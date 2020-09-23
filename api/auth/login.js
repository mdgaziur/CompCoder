const expressRouter = require('express').Router();
const userModel = require('../models/user');
const jwt_verify = require('../middlewares/jwt_verify');
const cb_errorcodes = require('../errorcodes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

expressRouter.use(jwt_verify);

const Login = expressRouter.post('/', async (req, res, next) => {
    let isLoggedIn = !req.invalid_jwt ? await userModel.findOne({ uuid: req.uuid }) : false;
    if (isLoggedIn) {
        res.json({
            error: "Already logged in",
            errorCode: cb_errorcodes.ALREADY_LOGGED_IN
        });
        res.end();
        next();
    }
    else {
        let userEmail = req.body.email;
        let userPassword = req.body.password;
        if (!userEmail || !userPassword) {
            res.status(401).json({
                error: "Incomplete form request!",
                errorCode: cb_errorcodes.INCOMPLETE_FORM_REQUEST,
            });
            res.end();
            next();
        }
        else {
            let user = await userModel.findOne({
                email: userEmail
            });
            if (user === null || !user) {
                res.status(401).json({
                    error: "User does not exists!",
                    errorCode: cb_errorcodes.NON_EXISTING_USER
                })
                res.end();
                next();
            }
            else {

                let saltedUserPassword = user.password;
                await bcrypt.compare(userPassword || '', saltedUserPassword || '', async (err, isValidPassword) => {
                    if (err) {
                        res.status(401).json({
                            error: "Authentication Error!",
                            errorCode: cb_errorcodes.AUTH_ERROR
                        });
                        res.end();
                        next();
                    }
                    else if (isValidPassword) {
                        let accessToken = await jwt.sign({
                            uuid: user.uuid
                        }, process.env.JWT_SECRET_TOKEN);
                        res.status(200).json({
                            accessToken: accessToken
                        });
                        res.end();
                        next();
                    }
                    else if (!isValidPassword) {
                        res.status(401).json({
                            error: "Wrong password!",
                            errorCode: cb_errorcodes.WRONG_PASSWORD
                        });
                        res.end();
                        next();
                    }
                });
            }
        }
    }
})

module.exports = Login;