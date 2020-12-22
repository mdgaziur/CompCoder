import { Problem } from "src/models/Problem";
import { DocumentType } from "@typegoose/typegoose";
import { S3 } from "ibm-cos-sdk";
import { mkdtempSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { v4 } from "uuid";
import { downloadTestcase } from "./lib/downloadTestcase";
import { errorCodes } from "src/errorCodes";

export async function downloader(problem: DocumentType<Problem>) {
  let cos = new S3({
    endpoint: "s3.eu-gb.cloud-object-storage.appdomain.cloud",
    apiKeyId: process.env.IBM_CLOUD_TESTCASES_BUCKET_API_KEY,
    serviceInstanceId: process.env.IBM_CLOUD_INSTANCE_KEY,
  });

  let testcasesMeta: any = problem.testcasesMeta;
  let sampleTestcasesMeta: any = problem.testcasesMeta;

  // create a temp directory
  let tmpDir = mkdtempSync(join(tmpdir(), v4()));

  // download all the hidden testcase files
  let hTestcasesCount = Object.keys(testcasesMeta).length;
  while (hTestcasesCount--) {
    try {
      let testcaseData: any = await downloadTestcase(
        "hidden",
        problem.problemId,
        testcasesMeta[hTestcasesCount],
        cos
      );

      writeFileSync(tmpDir, testcaseData);
    } catch {
      return {
        success: false,
        reason: errorCodes.JUDGE_TESTCASE_DOWNLOAD_FAILED,
      };
    }
  }

  // download all the sample testcases
  let sTestcasesCount = Object.keys(sampleTestcasesMeta).length;
  while (sTestcasesCount--) {
    try {
      let testcaseData: any = await downloadTestcase(
        "hidden",
        problem.problemId,
        testcasesMeta[sTestcasesCount],
        cos
      );

      writeFileSync(tmpDir, testcaseData);
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
