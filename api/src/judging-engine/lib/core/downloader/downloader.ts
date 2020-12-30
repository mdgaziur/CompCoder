import { Problem } from "src/models/Problem";
import { DocumentType } from "@typegoose/typegoose";
import { S3 } from "ibm-cos-sdk";
import { writeFileSync } from "fs";
import { join } from "path";
import { downloadTestcase } from "./lib/downloadTestcase";
import { errorCodes } from "../../../../../src/errorCodes";

export async function downloader(
  problem: DocumentType<Problem>,
  tmpDir: string
) {
  let cos = new S3({
    endpoint: "s3.eu-gb.cloud-object-storage.appdomain.cloud",
    apiKeyId: process.env.IBM_CLOUD_TESTCASES_BUCKET_API_KEY,
    serviceInstanceId: process.env.IBM_CLOUD_INSTANCE_KEY,
  });

  let testcasesMeta: any = problem.testcasesMeta;
  let sampleTestcasesMeta: any = problem.testcasesMeta;

  // download all the hidden testcase files
  let hTestcasesCount = Object.keys(testcasesMeta).length;
  while (hTestcasesCount--) {
    if (!testcasesMeta[hTestcasesCount + 1]) {
      break;
    }
    try {
      // download input
      let testcaseData: any = await downloadTestcase(
        "hidden",
        problem.problemId,
        testcasesMeta[hTestcasesCount + 1].input,
        cos
      );

      writeFileSync(
        join(tmpDir, "hidden", testcasesMeta[hTestcasesCount + 1].input),
        testcaseData
      );

      // download output
      testcaseData = await downloadTestcase(
        "hidden",
        problem.problemId,
        testcasesMeta[hTestcasesCount + 1].output,
        cos
      );

      writeFileSync(
        join(tmpDir, "hidden", testcasesMeta[hTestcasesCount + 1].output),
        testcaseData
      );
    } catch (e) {
      console.log(e, e.stack);
      return {
        success: false,
        reason: errorCodes.JUDGE_TESTCASE_DOWNLOAD_FAILED,
      };
    }
  }

  // download all the sample testcases
  let sTestcasesCount = Object.keys(sampleTestcasesMeta).length;
  while (sTestcasesCount--) {
    if (!sampleTestcasesMeta[sTestcasesCount + 1]) {
      break;
    }
    try {
      // download input
      let testcaseData: any = await downloadTestcase(
        "sample",
        problem.problemId,
        sampleTestcasesMeta[sTestcasesCount + 1].input,
        cos
      );

      writeFileSync(
        join(tmpDir, "sample", sampleTestcasesMeta[sTestcasesCount + 1].input),
        testcaseData
      );

      // download output
      testcaseData = await downloadTestcase(
        "sample",
        problem.problemId,
        sampleTestcasesMeta[sTestcasesCount + 1].output,
        cos
      );

      writeFileSync(
        join(tmpDir, "sample", sampleTestcasesMeta[sTestcasesCount + 1].output),
        testcaseData
      );
    } catch (e) {
      console.log(e, e.stack);
      return {
        success: false,
        reason: errorCodes.JUDGE_TESTCASE_DOWNLOAD_FAILED,
      };
    }
  }

  return {
    success: true,
    dir: tmpDir,
  };
}
