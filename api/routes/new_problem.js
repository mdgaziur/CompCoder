const expressRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const problemSchema = require('../models/problem');

const newProblem = expressRouter.all('/', async (req, res) => {
    let uuid = await jwt.verify(req.cookies.accessToken || '', process.env.JWT_SECRET_TOKEN, (err, uuid) => {
        if (err) return false;
        return uuid.uuid;
    });
    if(!uuid) {
        res.redirect('/login?return=/drafts/new_problem');
    }
    else {
        let user = await userSchema.findOne({ uuid: uuid });
        const problem_name = req.body.problem_name, problem_type = req.body.problem_type,
        problem_slug = req.body.problem_slug, function_name = req.body.function_name,
        memory_limit = req.body.memory_limit, cpu_limit = req.body.cpu_limit,
        testcases = req.body.test_case,
        problem_desc = req.body.desc_json;
        let errors = [];
        if(!problem_name) {
            errors.push("Must insert problem name!");
        }
        if(problem_type) {
            if(!function_name) {
                errors.push("Must insert function name!");
            }
        }
        if(!problem_slug) {
            errors.push("Must insert an unique problem slug!");
        }
        if(!memory_limit) {
            errors.push("Must insert a valid memory limit!");
        }
        if(!cpu_limit) {
            errors.push("Must insert a valid cpu limit!");
        }
        if(!testcases) {
            errors.push("Must select a testcase zip file!");
        }
        if(!problem_desc) {
            errors.push("Must give problem description");
        }
        if(errors) {
            if(errors.length>=8) {
                res.render('new_problem', { user: user });
            }
            else if(!errors) {
                //Add the problem to database
                //Check if the problem has unique slug
                let isDuplicateSlug = await problemSchema.findOne({ slug: problem_slug });
                if(!isDuplicateSlug) {
                    let problem = await problemSchema.create({
                        problem_name: problem_name,
                        problem_slug: problem_slug,
                        problem_type: problem_type,
                        problem_desc: problem_desc,
                        cpu_limit: cpu_limit,
                        memory_limit: memory_limit,
                        author: user
                    })
                    res.redirect('/drafts');
                } else {
                    res.render('new_problem', {
                        user: user,
                        errors: ["Slug must be unique!"]
                    })
                }
            }
            else {
                res.render('new_problem', { user: user, errors: errors })
            }
        }
    }
});

module.exports = newProblem;