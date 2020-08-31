const expressRouter = require('express').Router();
const userSchema = require('../models/user');
const jwt = require('jsonwebtoken');
const verify_token = require('../helper_functions/jwt_verify');
const bcrypt = require('bcrypt');

const Register = expressRouter.all('/', async (req, res) => {
    let name = req.body.name, 
    handle = req.body.handle, 
    email = req.body.email, 
    password = req.body.password, 
    confirm_password = req.body.password;
    //Check if the user already exists
    let uuid = await jwt.verify(req.session.accessToken, process.env.JWT_SECRET_TOKEN, (err, uuid) => {
        if (err) return false;
        return uuid.uuid;
    });
    if(uuid) {
        res.redirect('/');
    }
    else if(!name || !email || !handle || !password || !confirm_password) {
        res.render('register');
    }
    else if(name.length<4) {
        res.render('register', { Failed: "Name must be at least 4 charecters long." });
    }
    else if(name.length>32) {
        res.render('register', { Failed: "Name cannot have charecters more than 32 charecters." });
    }
    else if(password.length<8) {
        res.render('register', { Failed: "Password must be at least 8 charecters long." });
    }
    else if(password!=confirm_password) {
        res.render('register', { Failed: "Both password fields should be equal" })
    }
    else {
        const nameExists = await userSchema.findOne({ name: name });
        const handleExists = await userSchema.findOne({ handle: handle });
        const emailExists = await userSchema.findOne({ email: email });
        if(nameExists) res.render('register', { Failed: "User with the same name already exists!" })
        else if(emailExists) res.render('register', { Failed: "User with the email name already exists!" })
        else if(handleExists) res.render('register', { Failed: "User with the handle name already exists!" })
        else {
            //Add user to database
            const salted_password = await bcrypt.hash(password, 10);
            const user = await userSchema.create({
                name: name,
                email: email,
                handle: handle,
                password: salted_password
            })
            const accessToken = jwt.sign({ uuid : user.uuid }, process.env.JWT_SECRET_TOKEN, {
                expiresIn: '7d'
            });
            req.session.accessToken = accessToken;
            res.redirect('/');
        }
    }
})

module.exports = Register;