import { validateAndExtractTestcaseZipFile } from "../../utils/testcaseParser/index";
import { Problem } from "./../../models/Problem";
import { getModelForClass } from "@typegoose/typegoose";
import { Router } from "express";
import { body, validationResult } from "express-validator";
import { loginRequired } from "../middlewares/loginRequired";
import { problemShouldExist } from "../validators/problemShouldExist";

let expressRouter = Router();
expressRouter.use(loginRequired);

export const testcaseUpload = expressRouter.post(
  "/",
  [
    body("problemId")
      .notEmpty()
      .withMessage("Problem not specified!")
      .bail()
      .custom(problemShouldExist),
    body("testcaseType")
      .notEmpty()
      .withMessage("No testcase type specified!")
      .bail()
      .custom((type) => {
        if (type === "0" || type === "1") return true;
        return false;
      }),
  ],
  async (req: any, res: any) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(406);
      res.json(errors);
      res.end();
    } else {
      let problem = await getModelForClass(Problem).findOne({
        _id: req.body.problemId,
      });
      if (!problem) {
        res.status(404);
        res.end();
      } else {
        if (
          req.user._id.toString() !== problem.author?.toString() &&
          !(req.user.userTypes === "admin")
        ) {
          res.status(403);
          res.end();
        } else {
          let zipFile = req.files.zipFile;
          if (!zipFile) {
            res.status(406);
            res.end();
          } else {
            let {
              success,
              meta,
              reason,
            } = await validateAndExtractTestcaseZipFile(
              zipFile.data,
              problem._id,
              parseInt(req.body.testcaseType)
            );
            if (!success) {
              res.status(406);
              res.json({
                success: false,
                reason: reason,
              });
              res.end();
            } else {
              if (req.body.testcaseType === "1") {
                problem.testcasesMeta = meta;
              } else {
                problem.sampleTestcasesMeta = meta;
              }
              problem.save();
              res.json({
                success: true,
              });
              res.end();
            }
          }
        }
      }
    }
  }
);
