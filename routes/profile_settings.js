const expressRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');

const profileSettings = expressRouter.all('/', async (req, res) => {
    let uuid = await jwt.verify(req.session.accessToken, process.env.JWT_SECRET_TOKEN, (err, uuid) => {
        if (err) return false;
        return uuid.uuid;
    });
    if(!uuid) {
        res.redirect('/login?return=/settings/profile');
    }
    else {
        const user = await userSchema.findOne({ uuid: uuid });
        let name = 
        req.body.name, 
        email = req.body.email, 
        company = req.body.company, 
        instituition = req.body.institution, 
        website = req.body.website, 
        image = req.body.image;

        if(name != undefined) {
            user.name = name;
        }
        if(email != undefined) {
            user.email = email;
        }
        if(company != undefined) {
            user.company = company;
        }
        if(website != undefined) {
            user.website = website;
        }
        if(instituition != undefined) {
            user.institute = instituition;
        }
        if(image) {
            
            user.profile_pic = image;
        }
        await user.save();
        res.render('profile_settings', { user: user });
    }
});

module.exports = profileSettings;