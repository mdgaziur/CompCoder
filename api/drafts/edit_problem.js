const expressRouter = require('express').Router();
const cb_errorcodes = require('../errorcodes');
const loginRequired = require('../middlewares/loginRequired');
const problemModel = require('../models/problem');
const isNotUniqueProblemField = require('../utils/isNotUniqueProblemField');

expressRouter.use(loginRequired);

const editProblem = expressRouter.post('/edit_problem', async (req, res) => {
    let problemSlug = req.body.problem_slug;
    if(!problemSlug) {
        res.status(400).json({
            error: "No problem slug is specified!",
            errorCode: cb_errorcodes.INCOMPLETE_FORM_REQEUST
        });
        res.end();
    } else {
        let problem = await problemModel.findOne({
            slug: problemSlug
        });
        if(!problem) {
            res.status(404).json({
                error: "No problem with the given found!",
                errorCode: cb_errorcodes.NON_EXISTING_PROBLEM
            });
            res.end();
        }
        else {
            let userId = req.user._id.toString();
            let problemAuthorId = problem.creator.toString();
            if(userId !== problemAuthorId) {
                res.status(403).json({
                    error: "You are not allowed to edit this problem!",
                    errorCode: cb_errorcodes.NOT_ALLOWED
                });
                res.end();
            } else {
                let problemName = req.body.problem_name;
                let problemDescription = req.body.problem_description;
                if(problemName) {
                    if(await isNotUniqueProblemField(problemName, "name")) {
                        res.status(400).json({
                            error: "Make sure the problem name field is unique!",
                            errorCode: cb_errorcodes.NOT_UNIQUE_DETAILS
                        });
                        res.end();
                        return;
                    } else {
                        problem.name = problemName;
                    }
                }
                if(problemDescription) {
                    problem.description = problemDescription;
                }
                problem.save();
                res.json({
                    success: 1
                });
                res.end();
            }
        }
    }
});

module.exports = editProblem;