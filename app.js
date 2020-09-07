const express = require('express');
const mongoose = require('mongoose');
//const helmet = require('helmet');
const cookie_parser = require('cookie-parser');
const express_sessions = require('express-session');
const dotenv = require('dotenv');
const engine = require('ejs-blocks');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const cors = require('cors');

//Grab the config from .env file
dotenv.config();


//Configure MongoDB
mongoose.connect('mongodb://localhost/CodeBuddy', {
    useNewUrlParser: true, useUnifiedTopology: true
});


//Import all the routes required
const home = require('./routes/home');
const settings = require('./routes/settings');
const profileSettings = require('./routes/profile_settings');
const passwordSettings = require('./routes/password_settings');
const login = require('./routes/login');
const logout = require('./routes/logout');
const register = require('./routes/register');
const password_reset = require('./routes/password_reset');


//Initialize the app
const app = express();
app.use(bodyParser.json({limit:'50mb'})); 
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));
//app.use(helmet());
app.use(flash());
app.use(cors());
app.use(express_sessions(require('./session_config'))); //Use the options saved in the session_config.js file
app.engine('ejs', engine);
app.set('view engine', 'ejs');
if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
}

//Make the app use "static" folder to serve static files
app.use(express.static('static'));


//Make the app use the functions associated with the routes
app.use('/', home);
app.use('/settings', settings);
app.use('/settings/profile', profileSettings);
app.use('/login', login);
app.use('/settings/password', passwordSettings);
app.use('/logout', logout);
app.use('/register', register);
app.use('/password_reset', password_reset);


//Set the port to listen at
app.listen(1233);