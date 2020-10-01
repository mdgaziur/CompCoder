const expressRouter = require('express').Router();
const problemModel = require('../models/problem');
const cb_errorcodes = require('../errorcodes');

const getProblemById = expressRouter.post('/getProblemById', async (req, res) => {
    let problemId = req.body.problem_id;
    if(!problemId) {
        res.status(400).json({
            error: "No problem id specified!",
            errorCode: cb_errorcodes.INCOMPLETE_FORM_REQEUST
        });
        res.end();
    }
    else {
        let problem = await problemModel.findOne({
            _id: problemId
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

module.exports = getProblemById;