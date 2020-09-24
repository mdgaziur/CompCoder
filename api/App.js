//Get all the packages
const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');

//Load environment variables from the .env file
require('dotenv').config();

//Import all the routes
const auth = require('./auth/auth');
const user = require('./user/user');

//Connect to database
mongoose.connect('mongodb://localhost/CodeBuddy', {
    useNewUrlParser: true, useUnifiedTopology: true,
});

//Instantiate express
const app = express();

//Config the app
app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(body_parser.urlencoded({
    limit: '100mb',
    extended: false
}));

app.use('/auth/login', auth.login);
app.use('/auth/register', auth.register);
app.use('/auth/password_reset', auth.password_reset.resetPassword);
app.use('/auth/password_reset', auth.password_reset.isValidResetToken);
app.use('/auth/password_reset', auth.password_reset.sendPasswordResetEmail);
app.use('/userInfo', user.userInfo);
app.use('/userProfilePicture', user.userProfilePicture);
app.use('/userSettings', user.userSettings);

//The api will run at port 1233
app.listen(1233);
console.log('Listening on port 1233...');