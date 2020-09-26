const mongoose = require('mongoose');
const uuid = require('uuid');
const default_profile_pic = require('../assets/default_profile_pic');
const getCurrentDate = require('../utils/currentTime');

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
    website: {
        type: String,
        default: '',
    },
    company: {
        type: String,
        default: '',
    },
    institute: {
        type: String,
        default: '',
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
    },
    joined: {
        required: true,
        type: String,
        default: getCurrentDate,
    },
    user_submissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER_SUBMISSIONS'
    }],
    created_problems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problems'
    }],
    created_contests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contest'
    }],
    resetPin: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);