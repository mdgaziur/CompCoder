const mongoose = require('mongoose');
const uuid = require('uuid');
const default_profile_pic = require('../helper_functions/default_profile_pic');

const userSchema = new mongoose.Schema({
    uuid: {
        type: String,
        require: true,
        default: uuid.v4
    },
    profile_pic: {
        type: String,
        require: true,
        default: default_profile_pic
    },
    name: {
        type: String,
        require: true,
        minlength: 4,
        maxlength: 32
    },
    email: {
        type: String,
        require: true
    },
    handle: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }
})

module.exports = mongoose.model('User', userSchema);