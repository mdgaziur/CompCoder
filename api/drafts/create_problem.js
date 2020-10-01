const expressRouter = require('express').Router();
const cb_errorcodes = require('../errorcodes');
const loginRequired = require('../middlewares/loginRequired');
const isNotUniqueProblemField = require('../utils/isNotUniqueProblemField');
const problemModel = require('../models/problem');
const AdmZip = require('adm-zip');
const fs = require('fs');

expressRouter.use(loginRequired);

const create_problem = expressRouter.post('/create_problem', async (req, res) => {
    let user = req.user;
    let problem_name = req.body.problem_name;
    let problem_type = req.body.problem_type;
    let problem_slug = req.body.problem_slug;
    let problem_description = req.body.problem_description;
    let problem_cl = req.body.problem_cl;
    let problem_ml = req.body.problem_ml;
    let problem_testcases = req.body.testcases;
    if(!problem_name || !problem_type || !problem_slug || !problem_description || !problem_cl || !problem_ml || !problem_testcases) {
        res.status(400).json({
            error: "Not all the required datas are provided!",
            errorCode: cb_errorcodes.INCOMPLETE_FORM_REQEUST
        });
        res.end();
    }
    else {
        if(await isNotUniqueProblemField(problem_name, "name")) {
            res.json({
                error: "Problem name must be unique!",
                errorCode: cb_errorcodes.NOT_UNIQUE_DETAILS
            });
            res.end();
        } else if(await isNotUniqueProblemField(problem_slug, "slug")) {
            res.json({
                error: "Problem slug must be unique!",
                errorCode: cb_errorcodes.NOT_UNIQUE_DETAILS
            });
            res.end();
        } else {
            if(typeof problem_testcases !== 'string') {
                res.json({
                    error: "Testcases zip file must be base64 encoded",
                    errorCode: cb_errorcodes.INVALID_FILE_TYPE
                });
                res.end();
            } else {
                let testcasesBuffer = Buffer.from(problem_testcases, 'base64');
                let zip = new AdmZip(testcasesBuffer);
                let zipEntries = zip.getEntries();
                let SampleTCNameMatcher = /Sample-\d*.txt/g;
                let HiddenTCNameMatcher = /Hidden-\d*.txt/g;
                if(!fs.existsSync('./problem/testcases')) {
                    fs.mkdirSync('./problem/testcases');
                }
                if(!fs.existsSync(`./problem/testcases/${problem_slug}`)){
                    fs.mkdirSync(`./problem/testcases/${problem_slug}`);
                    fs.mkdirSync(`./problem/testcases/${problem_slug}/sampleTestcases`);
                    fs.mkdirSync(`./problem/testcases/${problem_slug}/hiddenTestcases`);
                }
                zipEntries.forEach(file => {
                    let isSample = SampleTCNameMatcher.test(file.entryName);
                    let isHiddenTC = HiddenTCNameMatcher.test(file.entryName);
                    if(isSample) {
                        let testcaseData = file.getData();
                        fs.writeFileSync(`./problem/testcases/${problem_slug}/sampleTestcases/${file.entryName.match(SampleTCNameMatcher)}`, testcaseData, (err) => {
                            err? console.log(err): '';
                        });
                    }
                    else if(isHiddenTC) {
                        let testcaseData = file.getData();
                        fs.writeFileSync(`./problem/testcases/${problem_slug}/hiddenTestcases/${file.entryName.match(HiddenTCNameMatcher)}`, testcaseData, (err) => {
                            err? console.log(err): '';
                        });
                    }
                });
                //Check if there is any testcase in the testcase directory
                let sampleTCDir = fs.readdirSync(`./problem/testcases/${problem_slug}/sampleTestcases`);
                let hiddenTCDir = fs.readdirSync(`./problem/testcases/${problem_slug}/hiddenTestcases`);
                let sampletestcases = 0;
                let hiddentestcases = 0;
                sampleTCDir.forEach(filename => {
                    if(filename.match(SampleTCNameMatcher)) {
                        sampletestcases++;
                    }
                });
                hiddenTCDir.forEach(filename => {
                    if(filename.match(HiddenTCNameMatcher)) {
                        hiddentestcases++;
                    }
                });
                if(sampletestcases > 0 && hiddentestcases > 0) {
                    let pythMemMul = typeof req.body.pythMemMul === 'number' ? req.body.pythMemMul : 5;
                    let cppMemMul = typeof req.body.cppMemMul === 'number' ? req.body.cppMemMul : 1;
                    let csMemMul = typeof req.body.csMemMul === 'number' ? req.body.csMemMul : 1;
                    let javaMemMul = typeof req.body.javaMemMul === 'number' ? req.body.javaMemMul : 1;
                    let bashMemMul = typeof req.body.bashMemMul === 'number' ? req.body.bashMemMul : 1;
                    let jsMemMul = typeof req.body.jsMemMul === 'number' ? req.body.jsMemMul : 1;
            
                    let pythTimeMul = typeof req.body.pythTimeMul === 'number' ? req.body.pythTimeMul : 5;
                    let cppTimeMul = typeof req.body.cppTimeMul === 'number' ? req.body.cppTimeMul : 1;
                    let csTimeMul = typeof req.body.csTimeMul === 'number' ? req.body.csTimeMul : 1;
                    let javaTimeMul = typeof req.body.javaTimeMul === 'number' ? req.body.javaTimeMul : 1;
                    let bashTimeMul = typeof req.body.bashTimeMul === 'number' ? req.body.bashTimeMul : 1;
                    let jsTimeMul = typeof req.body.jsTimeMul === 'number' ? req.body.jsTimeMul : 1;
            
                    let allowedLanguages = typeof req.body.allowedLanguages === 'object' ? req.body.allowedLanguages : [1, 1, 1, 1, 1, 1];

                    //Check if description is in json format
                    try {
                        if(typeof problem_description !== 'object'){
                            throw "Problem description must be in JSON format!"
                        }
                        problem = await problemModel.create({
                            name: problem_name,
                            slug: problem_slug,
                            desc: problem_description,
                            creator: user._id,
                            testcasesID: problem_slug,
                            ml: problem_ml,
                            cl: problem_cl,
                            allowedLanguages: allowedLanguages,
                            //Memory limit for each language
                            pythMemMul: pythMemMul,
                            cppMemMul: cppMemMul,
                            csMemMul: csMemMul,
                            bashMemMul: bashMemMul,
                            javaMemMul: javaMemMul,
                            jsMemMul: jsMemMul,
                            //Time limit for each language
                            pythTimeMul: pythTimeMul,
                            cppTimeMul: cppTimeMul,
                            csTimeMul: csTimeMul,
                            bashTimeMul: bashTimeMul,
                            javaTimeMul: javaTimeMul,
                            jsTimeMul: jsTimeMul
                        });
                        user.created_problems.push(problem._id);
                        user.save();
                        res.json(problem);
                        res.end();
                    } catch(e) {
                        console.log(e)
                        res.json({
                            error: "Problem description must be in JSON format!",
                            errorCode: cb_errorcodes.INVALID_JSON_FORMAT
                        });
                        res.end();
                    }
                }
                else {
                    res.json({
                        error: "No sample testcase or hidden testcase given!",
                        errorCode: cb_errorcodes.NO_SAMPLE_OR_HIDDEN_TESTCASE
                    });
                    res.end();
                }
            }
        }
    }
});

module.exports = create_problem;