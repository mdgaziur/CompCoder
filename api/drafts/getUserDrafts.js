const expressRouter = require('express').Router();
const loginRequired = require('../middlewares/loginRequired');

expressRouter.use(loginRequired);

const getUserDrafts = expressRouter.all('/getUserDrafts', (req, res) => {
    let user = req.user;
    let problems = user.created_problems;
    let contests = user.created_contests;
    res.json({
        created_problems: problems,
        created_contests: contests
    });
    res.end();
});

module.exports = getUserDrafts;