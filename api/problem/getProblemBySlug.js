const expressRouter = require('express').Router();
const problemModel = require('../models/problem');
const cb_errorcodes = require('../errorcodes');

const getProblemBySlug = expressRouter.post('/getProblemBySlug', async (req, res) => {
    let problemSlug= req.body.problem_slug;
    if(!problemSlug) {
        res.status(400).json({
            error: "No problem Slug specified!",
            errorCode: cb_errorcodes.INCOMPLETE_FORM_REQEUST
        });
        res.end();
    }
    else {
        let problem = await problemModel.findOne({
            slug: problemSlug
        });
        if(!problem) {
            res.status(404).json({
                error: "Problem not found!",
                errorCode: cb_errorcodes.NON_EXISTING_PROBLEM
            });
            res.end();
        }
        else {
            res.json(problem);
            res.end();
        }
    }
});

module.exports = getProblemBySlug;