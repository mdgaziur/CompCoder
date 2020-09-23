const expressRouter = require('express').Router();
const userModel = require('../models/user');

const userInfo = expressRouter.all('/:username', async (req, res, next) => {
    let username = req.params.username;
    if(username) {
        let user = await userModel.findOne({
            handle: username
        });
        if(!user){
            res.status(404);
            res.end();
        }
        else{
            let userDetails = {
                name: user.name,
                base64ProfilePictureLink: req.protocol+"://"+req.get('host')+"/userProfilePicture/"+user.handle,
                username: user.handle,
                submissions: user.user_submissions,
                email: user.email,
                website: user.website,
                company: user.company,
                institute: user.institute,
                joined: user.joined,
                created_problems: user.created_problems
            }
            res.json(userDetails);
            res.end();
        }
    }
    else{
        res.status(404);
        res.end();
    }
});

module.exports = userInfo;