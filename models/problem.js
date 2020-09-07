const mongoose = require('mongoose');
const { Int32 } = require('mongodb');

const ProblemSchema = mongoose.Schema({
    slug: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true,
    },
    submissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission'
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    testcasesID: {
        type: String,
        required: true
    },
    mle: {
        type: Int32,
        required: true
    },
    cle: {
        type: Int32,
        required: true
    },
    pythTimeMul: {
        type: Int32,
        required: true,
        default: 1
    },
    cTimeMul: {
        type: Int32,
        required: true,
        default: 1
    },
    cppTimeMul: {
        type: Int32,
        required: true,
        default: 1
    },
    csTimeMul: {
        type: Int32,
        required: true,
        default: 1
    },
    bashTimeMul: {
        type: Int32,
        required: true,
        default: 1
    },
    jsTimeMul: {
        type: Int32,
        required: true,
        default: 1
    },
    javaTimeMul: {
        type: Int32,
        required: true,
        default: 1
    }
});

module.exports = mongoose.model('Problem', ProblemSchema);