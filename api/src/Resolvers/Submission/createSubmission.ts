import { join } from "path";
import { Problem } from "./../../models/Problem";
import { judgeEngine } from "./../../judging-engine/index";
import { verdicts } from "./../../judging-engine/verdicts";
import { Submission } from "./../../models/Submission";
import { DocumentType, getModelForClass } from "@typegoose/typegoose";
import { problemShouldExist } from "../../REST/validators/problemShouldExist";
// import { judge } from "../../judging-engine/index";
import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { tmpdir } from "os";
import { existsSync, mkdtempSync, readFileSync } from "fs";
import {
  downloadTestcasesUUID,
  downloadTestcases,
} from "../../utils/testcaseDownloader";
import { UserInputError } from "apollo-server";

@Resolver()
export class createSubmission {
  @Authorized()
  @Mutation(() => Submission)
  async createSubmission(
    @Arg("problemId", () => String) problemId: string,
    @Arg("code", () => String) code: string,
    @Arg("languageId", () => Number) languageId: 0 | 1 | 2 | 3 | 4 | 5 | 6,
    @Arg("testcaseType", () => String) testcaseType: "full" | "sample",
    @Ctx() context: any
  ) {
    if (languageId < 0 || languageId > 6) {
      throw new UserInputError("Unknown Language!", {
        inputArg: ["languageId"],
      });
    }
    if (!["full", "sample"].includes(testcaseType)) {
      throw new UserInputError("Unknown testcase type!", {
        inputArg: ["testcaseType"],
      });
    }
    if (!(await problemShouldExist(problemId))) {
      throw new UserInputError("Problem does not exists!", {
        inputArg: ["testcaseType"],
      });
    }
    let problemModel = getModelForClass(Problem);
    let problem = await problemModel.findOne({
      problemId: problemId,
    });
    let submissionModel = getModelForClass(Submission);
    let submission: DocumentType<Submission>;
    if (testcaseType === "sample") {
      submission = await submissionModel.create({
        problem: problemId,
        author: context.user,
        sourceFileData: code,
        verdict: verdicts.JUDGE_Q,
        isSampleSubmission: true,
      });
    } else {
      submission = await submissionModel.create({
        problem: problemId,
        author: context.user,
        sourceFileData: code,
        verdict: verdicts.JUDGE_Q,
        isSampleSubmission: false,
      });
    }
    if (!problem?.testcasesMeta || !problem?.sampleTestcasesMeta) {
      throw new UserInputError(
        "Problem does not have sample or hidden testcase!",
        {
          inputArg: ["problemId"],
        }
      );
    } else if (
      problem?.testcasesMeta.length === 0 ||
      problem?.sampleTestcasesMeta.length === 0
    ) {
      throw new UserInputError(
        "Problem does not have sample or hidden testcase!",
        {
          inputArg: ["problemId"],
        }
      );
    } else {
      let testcasesDir;
      if (process.env.NODE_ENV === "production") {
        testcasesDir = join(tmpdir(), problemId);
        if (existsSync(testcasesDir)) {
          let uuidFileData = readFileSync("uuid.txt").toString();
          let uuidFileFromCloud = await downloadTestcasesUUID(problemId);
          if (uuidFileData !== uuidFileFromCloud) {
            let isSuccess = await downloadTestcases(
              problemId,
              "sample",
              testcasesDir,
              problem?.testcasesMeta
            );
            if (!isSuccess) {
              return "Unknown Server Error";
            }
            let isSuccessH = await downloadTestcases(
              problemId,
              "hidden",
              testcasesDir,
              problem?.testcasesMeta
            );
            if (!isSuccessH) {
              return "Unknown Server Error";
            }
          }
        } else {
          mkdtempSync(testcasesDir);
          let s = await downloadTestcases(
            problemId,
            "sample",
            testcasesDir,
            problem?.sampleTestcasesMeta
          );
          let y = await downloadTestcases(
            problemId,
            "hidden",
            testcasesDir,
            problem?.testcasesMeta
          );

          if (!s || !y) {
            return "Unknown server error!";
          }
        }
      } else {
        testcasesDir = join("files", problemId);
      }
      let judger = new judgeEngine(
        problem?.testcasesMeta,
        problem?.sampleTestcasesMeta,
        testcasesDir,
        problem?.memoryLimit,
        problem?.timeLimit,
        submission,
        languageId,
        code,
        testcaseType
      );
      judger.start();

      problem?.Submissions?.push(submission._id);
      return submission;
    }
  }
}
