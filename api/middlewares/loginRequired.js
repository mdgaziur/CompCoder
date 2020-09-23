const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const loginRequired = async (req, res, next) => {
    let accessToken = req.body.accessToken;
    if(!accessToken) {
        res.status(403);
        res.end();
    }
    else {
        //Verify each one. If any of the two accessToken is valid, call next()
        await jwt.verify(accessToken, process.env.JWT_SECRET_TOKEN, async (err, uuid) => {
            if(err) {
                console.log(err);
                res.status(403);
                res.end();
            }
            else {
                let user = await userModel.findOne({
                    uuid: uuid.uuid
                });
                if(user){
                    req.user = user;
                    next();
                }
                else {
                    res.status(403);
                    res.end();
                }
            }
        });
    }
}

module.exports = loginRequired;