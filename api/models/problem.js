
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
        type: Object,
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
    ml: {
        type: Number,
        required: true
    },
    cl: {
        type: Number,
        required: true
    },
    allowedLanguages: {
        type: Array,
        required: true,
        default: [1, 1, 1, 1, 1, 1]
    },
    pythMemMul: {
        type: Number,
        required: true,
        default: 5
    },
    cppMemMul: {
        type: Number,
        required: true,
        defualt: 1
    },
    csMemMul: {
        type: Number,
        required: true,
        defualt: 1
    },
    bashMemMul: {
        type: Number,
        required: true,
        defualt: 1
    },
    javaMemMul: {
        type: Number,
        required: true,
        defualt: 1
    },
    jsMemMul: {
        type: Number,
        required: true,
        defualt: 1
    },
    pythTimeMul: {
        type: Number,
        required: true,
        default: 5
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