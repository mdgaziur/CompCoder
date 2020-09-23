const expressRouter = require('express').Router();
const userModel = require('../models/user');
const jwt_verify = require('../middlewares/jwt_verify');
const cb_errorcodes = require('../errorcodes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendPasswordResetEmail = require('./email/pr_email');

expressRouter.use(jwt_verify);

const passwordResetEmail = expressRouter.post('/sendPrEmail',async (req, res, next) => {
    if(req.user) {
        res.json({
            error: "Already logged in!",
            errorCode: cb_errorcodes.ALREADY_LOGGED_IN
        });
    }
    else {
        let email = req.body.email;
        if(!email) {
            res.json({
                error: "No email specified!",
                errorCode: cb_errorcodes.INCOMPLETE_FORM_REQEUST
            });
        }
        else {
            let user = await userModel.findOne({
                email: email
            });
            if(!user) {
                res.json({
                    error: "User doesn't exists!",
                    errorCode: cb_errorcodes.NON_EXISTING_USER
                });
            }
            else {
                let resetToken = jwt.sign({
                    uuid: user.uuid
                }, process.env.JWT_SECRET_TOKEN);
                await sendPasswordResetEmail(email, resetToken);
                res.json({
                    sent: 1
                });
            }
        }
    }
    res.end();
});

const isValidResetToken = expressRouter.post('/isValidToken', async (req, res, next) => {
    if(req.user) {
        res.json({
            error: "Already logged in!",
            errorCode: cb_errorcodes.ALREADY_LOGGED_IN
        });
    }
    else {
        let token = req.body.resetToken;
        if(!token) {
            res.json({
                error: "No reset token given!",
                errorCode: cb_errorcodes.INCOMPLETE_FORM_REQEUST
            });
        }
        else {
            await jwt.verify(token, process.env.JWT_SECRET_TOKEN, async (err, payload) => {
                if(err) {
                    res.json({
                        isValid: false
                    });
                }
                else {
                    let user = await userModel.findOne({
                        uuid: payload.uuid
                    });
                    if(!user) {
                        res.json({
                            isValid: false
                        });
                    }
                    else {
                        res.json({
                            isValid: true
                        });
                    }
                }
            });
        }
    }
    res.end();
});

const resetPassword = expressRouter.post('/setPassword', async (req, res, next) => {
    if(req.user) {
        res.json({
            error: "Already logged in!",
            errorCode: cb_errorcodes.ALREADY_LOGGED_IN
        });
    }
    else {
        let token = req.body.resetToken;
        let newPassword = req.body.newPassword;
        if(!token || !newPassword) {
            res.json({
                error: "Incomplete form request!",
                errorCode: cb_errorcodes.INCOMPLETE_FORM_REQEUST
            });
        }
        else {
            await jwt.verify(token, process.env.JWT_SECRET_TOKEN, async (err, payload) => {
                if(err) {
                    res.json({
                        error: "Invalid reset token",
                        errorCode: cb_errorcodes.INVALID_TOKEN
                    });
                }
                else {
                    let user = await userModel.findOne({
                        uuid: payload.uuid
                    });
                    if(!user) {
                        res.json({
                            error: "Invalid reset token",
                            errorCode: cb_errorcodes.INVALID_TOKEN
                        });
                    }
                    else {
                        let saltedPassword = await bcrypt.hash(newPassword, 10);
                        user.password = saltedPassword;
                        user.save( err => {
                            console.log(err);
                        });
                        let accessToken = jwt.sign({
                            uuid: user.uuid
                        }, process.env.JWT_SECRET_TOKEN);
                        res.json({
                            accessToken: accessToken
                        });
                    }
                }
            });
        }
    }
    res.end();
});

module.exports.sendPasswordResetEmail = passwordResetEmail;
module.exports.isValidResetToken = isValidResetToken;
module.exports.resetPassword = resetPassword;