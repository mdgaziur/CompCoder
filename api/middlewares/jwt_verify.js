const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const jwt_verify = async (req, res, next) => {

    if(!req.body.accessToken) {
        req.invalid_jwt = true;
        next();
    }
    else {
        //Verify each one. If any of the two accessToken is valid, call next()
        await jwt.verify(req.body.accessToken, process.env.JWT_SECRET_TOKEN, async (err, uuid) => {
            if(err) {
                req.invalid_jwt = true;
                next();
            }
            else {
                let user = await userModel.findOne({
                    uuid: uuid.uuid
                });
                if(user){
                    req.invalid_jwt = false;
                    req.user = user;
                    next();
                }
                else {
                    req.invalid_jwt = true;
                    req.user = user;
                    next();
                }
            }
        });
    }
}

module.exports = jwt_verify;