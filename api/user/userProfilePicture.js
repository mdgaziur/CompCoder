const expressRouter = require('express').Router();
const userModel = require('../models/user');

const userProfilePicture = expressRouter.all('/:username', async (req, res, next) => {
    let username = req.params.username;
    if(username) {
        let user = await userModel.findOne({
            handle: username
        });
        if (!user) {
            res.status(404);
            res.end();
        }
        else {
            res.json({
                userImage: user.profile_pic
            });
            res.end();
        }
    }
    else {
        res.status(404);
        res.end();
    }
});

module.exports = userProfilePicture;