import { compcoderJudge } from "./lib/core/engine";
import { readFileSync, watch, writeFileSync } from "fs";
import { verdicts } from "./lib/core/verdicts";
import { getModelForClass } from "@typegoose/typegoose";
import { Problem } from "src/models/Problem";

async function judge(
  problemId: string,
  code: string,
  author: string,
  languageId: number,
  testcaseType: "full" | "sample" | "output"
) {
  let problemModel = getModelForClass(Problem);
  let problem = await problemModel.findOne({
    problemId: problemId,
  });

  if (problem) {
    let engine = new compcoderJudge(
      code,
      problemId,
      languageId,
      problem.memoryLimit,
      problem.cpuLimit,
      author
    );

    await engine.downloadTestcases();
    await engine.createSubmission();
    engine.createContainer();
    let success = engine.buildContainer();
    if (!success) {
      return verdicts.JUDGE_COMPILE_ERROR;
    }
    if (testcaseType === "sample") {
      let sampleTestcases = problem.sampleTestcasesMeta;
      if (!sampleTestcases) {
        throw new Error("Problem does not have any sample testcase!");
      }

      let testcaseIds = Object.keys(sampleTestcases);
      testcaseIds.forEach((id) => {
        engine.runContainer(id);
      });
    }
  } else {
    throw new Error("The problem is probably deleted");
  }
}
