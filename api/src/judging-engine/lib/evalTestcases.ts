import { verdicts } from "../verdicts";
import { join } from "path";
import { readFileSync } from "fs";
import { DocumentType } from "@typegoose/typegoose";
import { Submission } from "../../models/Submission";
import { languageInf, testcaseMetaType } from "../types";
import { runContainer } from "./runContainer";

/**
 *
 * @param imageID Image Id of the container
 * @param testcasesMeta Metadata of the testcases
 * @param sourceCodeFileName Filename of the source code file
 * @param submission Submission Document
 * @param testcaseDir Directory containing testcases
 * @param memL Memory Limit
 * @param tL Time Limit
 * @param language programming language the source code written in
 * @param testcaseType Type of the testcase (sample or hidden)
 */
export async function evalTestcases(
  imageID: string,
  testcasesMeta: testcaseMetaType[],
  sourceCodeFileName: string,
  submission: DocumentType<Submission>,
  testcaseDir: string,
  memL: number,
  tL: number,
  language: languageInf,
  testcaseType: "hidden" | "sample"
) {
  for (let idx in testcasesMeta) {
    console.log(testcasesMeta[idx]);
    let inputFile = testcasesMeta[idx].input;
    let outputFile = testcasesMeta[idx].output;

    let inputData = readFileSync(join(testcaseDir, inputFile)).toString();
    let outputData = readFileSync(join(testcaseDir, outputFile)).toString();

    try {
      let output = await runContainer(
        imageID,
        inputData,
        language.getRunCMD(sourceCodeFileName),
        memL,
        tL
      );

      if (testcaseType === "hidden") {
        if (output === outputData) {
          if (!submission.testcasesVerdict) {
            submission.testcasesVerdict = [verdicts.JUDGE_AC];
          } else {
            submission.testcasesVerdict.push(verdicts.JUDGE_AC);
          }
        } else {
          if (!submission.testcasesVerdict) {
            submission.testcasesVerdict = [verdicts.JUDGE_WA];
          } else {
            submission.testcasesVerdict.push(verdicts.JUDGE_WA);
          }
        }
      } else {
        if (output === outputData) {
          if (!submission.sampleTestcasesVerdict) {
            submission.sampleTestcasesVerdict = [verdicts.JUDGE_AC];
          } else {
            submission.sampleTestcasesVerdict.push(verdicts.JUDGE_AC);
          }
        } else {
          if (!submission.sampleTestcasesVerdict) {
            submission.sampleTestcasesVerdict = [verdicts.JUDGE_WA];
          } else {
            submission.sampleTestcasesVerdict.push(verdicts.JUDGE_WA);
          }
        }
      }
    } catch (e) {
      if (testcaseType === "hidden") {
        if (!submission.testcasesVerdict) {
          submission.testcasesVerdict = [e];
        } else {
          submission.testcasesVerdict.push(e);
        }
      } else {
        if (!submission.sampleTestcasesVerdict) {
          submission.sampleTestcasesVerdict = [e];
        } else {
          submission.sampleTestcasesVerdict.push(e);
        }
      }
    }

    await submission.save();
  }
}
