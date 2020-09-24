const expressRouter = require('express').Router();
const cb_errorcodes = require('../errorcodes');
const loginRequired = require('../middlewares/loginRequired');
const jimp = require('jimp');

expressRouter.use(loginRequired);

const userProfilePicUpdate = expressRouter.post('/', (req, res) => {
    let profilePic = req.body.profilePic;
    if(typeof profilePic !== 'string') {
        res.status(400).json({
            error: "Must be a base64 encoded PNG or JPG file!",
            errorCode: cb_errorcodes.INVALID_FILE_TYPE
        });
    }
    else {
        if(btoa(atob(profilePic))===profilePic) {
            let imgBuf = Buffer.from(profilePic, 'base64');
            jimp.read(imgBuf).then((img) => {
                if(img.bitmap.width > 0 && img.bitmap.height > 0) {
                    let user = req.user;
                    user.profilePic = profilePic;
                    user.save();
                } else{
                    res.status(400).json({
                        error: "Must be a base64 encoded PNG or JPG file!",
                        errorCode: cb_errorcodes.INVALID_FILE_TYPE
                    });
                }
            })
        } else{
            res.status(400).json({
                error: "Must be a base64 encoded PNG or JPG file!",
                errorCode: cb_errorcodes.INVALID_FILE_TYPE
            });
        }
    }
    res.end();
});

module.exports = userProfilePicUpdate;