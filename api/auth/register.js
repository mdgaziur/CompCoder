const expressRouter = require('express').Router();
const userModel = require('../models/user');
const jwt_verify = require('../middlewares/jwt_verify');
const cb_errorcodes = require('../errorcodes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

expressRouter.use(jwt_verify);

const Register = expressRouter.post('/', async (req, res, next) => {
    let isLoggedIn = !req.invalid_jwt ? await userModel.findOne({ uuid: req.uuid }) : false;
    if (isLoggedIn) {
        res.json({
            error: "Already logged in!",
            errcode: cb_errorcodes.ALREADY_LOGGED_IN
        });
        res.end();
        next();
    }else {
        let name = req.body.name;
        let email = req.body.email;
        let userName = req.body.username;
        let password = req.body.password;

        if(!name || !email || !userName || !password) {
            res.status(401).json({
                error: "Incomplete form request!",
                errorCode: cb_errorcodes.INCOMPLETE_FORM_REQEUST
            });
            res.end();
            next();
        }
        else {
            let notUniqueName = await userModel.findOne({
                name: name
            });
            let notUniqueEmail = await userModel.findOne({
                email: email
            });
            let notUniqueUsername = await userModel.findOne({
                handle: userName
            });
            if(notUniqueName || notUniqueEmail || notUniqueUsername) {
                res.json({
                    error: "Not unique email or userName or name!",
                    errorCode: cb_errorcodes.NOT_UNIQUE_DETAILS
                });
                res.end();
                next();
            }
            else{
                //Salt the password
                let saltedPassword = await bcrypt.hash(password, 10);
                let user = await userModel.create({
                    name: name,
                    email: email,
                    handle: userName,
                    password: saltedPassword
                });
                //Generate the accessToken and send as json
                let accessToken = await jwt.sign({
                    uuid: user.uuid
                }, process.env.JWT_SECRET_TOKEN);
                res.json({
                    accessToken: accessToken
                });
                res.end();
                next();
            }
        }
    }
});

module.exports = Register;