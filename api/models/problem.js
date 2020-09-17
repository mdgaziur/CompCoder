const mongoose = require('mongoose');

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
        type: Number,
        required: true
    },
    cle: {
        type: Number,
        required: true
    },
    pythTimeMul: {
        type: Number,
        required: true,
        default: 5
    },
    cTimeMul: {
        type: Number,
        required: true,
        default: 1
    },
    cppTimeMul: {
        type: Number,
        required: true,
        default: 1
    },
    csTimeMul: {
        type: Number,
        required: true,
        default: 1
    },
    bashTimeMul: {
        type: Number,
        required: true,
        default: 1
    },
    jsTimeMul: {
        type: Number,
        required: true,
        default: 1
    },
    javaTimeMul: {
        type: Number,
        required: true,
        default: 1
    }
});

module.exports = mongoose.model('ProblemSchema', ProblemSchema);