const expressRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const bcrypt = require('bcrypt');

const passwordSettings = expressRouter.all('/', async (req, res) => {
    let uuid = await jwt.verify(req.session.accessToken, process.env.JWT_SECRET_TOKEN, (err, uuid) => {
        if (err) return false;
        return uuid.uuid;
    });
    if(!uuid) {
        res.redirect('/login?return=/settings/password');
    }
    else {
        let password = req.body.password;
        let oldPassword = req.body.oldpassword;
        let password_confirm = req.body.confirm_password;
        const user = await userSchema.findOne({ uuid: uuid });
        if(oldPassword) {
            if (!password) {
                res.render('password_settings', { user:user , Failed: 'Fill all the fields to continue' });
            }
            else {                
                if (!password_confirm) {
                    res.render('password_settings', { user:user , Failed: 'Fill all the fields to continue' });
                }
                else {
                    if (password !== password_confirm) {
                        res.render('password_settings', { user:user , Failed: 'Enter the same password in both fields!' });
                    }
                    else {
                        await bcrypt.compare(oldPassword, user.password, async (err, correctPassword) => {
                            if(err) {
                                res.render('password_settings' , { user: user, Failed: "Review all the fields and try again" });
                            }
                            if(correctPassword) {
                                let shashedPassword = await bcrypt.hash(password, 10);
                                user.password = shashedPassword;
                                (await user).save();
                                res.render('password_settings', { user:user, Success: 'Password Updated Successfully' });
                            }
                            else {
                                res.render('password_settings', { user:user , Failed: 'Wrong Password! Enter the correct previous password.' });
                            }
                        });
                    }
                }
            }
        }
        else {
            res.render('password_settings', { user:user });
        }
    }
});

module.exports = passwordSettings;