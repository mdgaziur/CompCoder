const expressRouter = require('express').Router();
const loginRequired = require('../middlewares/loginRequired');
const isNotUniqueField = require('../utils/isNotUniqueField');
const cb_errorcodes = require('../errorcodes.js');

expressRouter.use(loginRequired);

const notUniqueFieldError = (res, fieldName) => {
    res.status(400).json({
        error: `There is another account with that same ${fieldName}!`,
        errorCode: cb_errorcodes.NOT_UNIQUE_DETAILS,
        success: 0,
    });
    res.end();
}

const userSettings = expressRouter.post('/', async (req, res, next) => {
    let name = req.body.name, email = req.body.email, website = req.body.website, company = req.body.company, institute = req.body.institute;
    let user = req.user;
    if(name) {
        if(await isNotUniqueField(name, req.user, "name")) {
            notUniqueFieldError(res, "name");
            return;
        }
        else {
            user.name = name;
        }
    }
    if(email) {
        if(await isNotUniqueField(email, req.user, "email")) {
            notUniqueFieldError(res, "email");
            return;
        }
        else {
            user.email = email;
        }
    }
    if(typeof website !== 'undefined') {
        if(website === "https://google.com" || website === "https://facebook.com" || website === "https://twitter.com") {
            res.status(400).json({
                error: "Are you kidding me? The real owners would never create account here!"
            });
            res.end();
            return;
        }
        else {
            user.website = website;
        }
    }
    if(typeof company !== 'undefined') {
        user.company = company;
    }
    if(typeof institute !== 'undefined') {
        user.institute = institute;
    }
    user.save();
    res.json({
        success: 1
    });
    res.end();
});

module.exports = userSettings;