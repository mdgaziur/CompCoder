import { compcoderJudge } from "./lib/core/engine";
import { getModelForClass } from "@typegoose/typegoose";
import { Problem } from "../models/Problem";

export async function judge(
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
    try {
      engine.createContainer();
      await engine.downloadTestcases();
      await engine.createSubmission();
      engine.buildContainer();
    } catch (e) {
      console.log(e);
      return e;
    }
    if (testcaseType === "sample") {
      let sampleTestcases: any = problem.sampleTestcasesMeta;
      if (!sampleTestcases) {
        throw new Error("Problem does not have any sample testcase!");
      }

      let testcaseIds = Object.keys(sampleTestcases);
      testcaseIds.forEach((id) => {
        engine.runContainer(
          sampleTestcases[id].input,
          sampleTestcases[id].output,
          "sample"
        );
      });
    } else if (testcaseType === "full") {
      let sampleTestcases: any = problem.sampleTestcasesMeta;
      if (!sampleTestcases) {
        throw new Error("Problem does not have any sample testcase!");
      }

      let sTestcaseIds = Object.keys(sampleTestcases);
      console.log(sTestcaseIds);
      sTestcaseIds.forEach((id) => {
        engine.runContainer(
          sampleTestcases[id].input,
          sampleTestcases[id].output,
          "sample"
        );
      });

      let hiddenTestcases: any = problem.testcasesMeta;
      if (!hiddenTestcases) {
        throw new Error("Problem does not have any hidden testcase!");
      }

      let hTestcaseIds = Object.keys(hiddenTestcases);
      console.log(hTestcaseIds);
      hTestcaseIds.forEach((id: any) => {
        engine.runContainer(
          hiddenTestcases[id].input,
          hiddenTestcases[id].output,
          "hidden"
        );
      });
    }
    return engine.getSubmission();
  } else {
    throw new Error("The problem is probably deleted");
  }
}
