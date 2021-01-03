import { languages } from "./language";
import { DocumentType } from "@typegoose/typegoose";
import { languageInf, testcaseMetaType } from "./types";
import { Submission } from "../models/Submission";
import { createTempWorkdir } from "./lib/workdir";
import { writeFileSync } from "fs";
import { join } from "path";
import { dockergen } from "./lib/dockergen";
import { v4 } from "uuid";
import { buildContainer } from "./lib/buildContainer";
import { evalTestcases } from "./lib/evalTestcases";
import { verdicts } from "./verdicts";

export class judgeEngine {
  private testcasesMeta: testcaseMetaType[];
  private sampleTestcasesMeta: testcaseMetaType[];
  private testcaseDir: string;
  private memL: number;
  private tL: number;
  private submission: DocumentType<Submission>;
  private language: languageInf;
  private sourceCode: string;
  private tempWorkDir: string;
  private sourceCodeFileName: string;
  private imageID: string;
  private testcaseType: "sample" | "full";

  /**
   *
   * @param {testcaseMetaType[]} sampleTestcaseMeta Metadata containing info about the sample testcases
   * @param {testcaseMetaType[]} testcasesMeta Metadata containing info about the testcases
   * @param {string} testcaseDir Directory where testcases are saved
   * @param {number} memL Maximum allowed memory space for the program to use(in megabytes)
   * @param {number} tL Maximum allowed time for the program tun execute(in milliseconds)
   * @param {DocumentType<Submission>} submission Mongodb document containing the submission
   * @param {(0 | 1 | 2 | 3 | 4 | 5 | 6)} languageID Indicates which language the source code written in
   * @param {string} sourceCode Contains the source code which will be compiled and ran
   */
  constructor(
    testcasesMeta: testcaseMetaType[],
    sampleTestcaseMeta: testcaseMetaType[],
    testcaseDir: string,
    memL: number,
    tL: number,
    submission: DocumentType<Submission>,
    languageID: 0 | 1 | 2 | 3 | 4 | 5 | 6,
    sourceCode: string,
    testcaseType: "sample" | "full"
  ) {
    this.testcasesMeta = testcasesMeta;
    this.sampleTestcasesMeta = sampleTestcaseMeta;
    this.testcaseDir = testcaseDir;
    this.memL = memL;
    this.tL = tL;
    this.submission = submission;
    this.language = languages[languageID];
    this.sourceCode = sourceCode;
    this.testcaseType = testcaseType;
  }

  /**
   * Starts the judging process
   * This function does not return anything. It automatically updates the submission database. The client can get the status through a
   * socket.io connection.
   */
  async start() {
    this.tempWorkDir = createTempWorkdir();

    // generate a random uuid for the filename with extension of our source code
    this.sourceCodeFileName = v4() + this.language.extension;

    // save the file in our temporary directory
    writeFileSync(
      join(this.tempWorkDir, this.sourceCodeFileName),
      this.sourceCode
    );

    // generate contents of the Dockerfile
    let Dockerfile: string;
    // we'll only need RUN if the source code needs to be compiled
    if (this.language.compiled && this.language.getCompileCMD) {
      Dockerfile = dockergen(
        this.language.dockerImage,
        this.tempWorkDir,
        this.sourceCodeFileName,
        this.language.getCompileCMD(this.sourceCodeFileName)
      );
    } else {
      Dockerfile = dockergen(
        this.language.dockerImage,
        this.tempWorkDir,
        this.sourceCodeFileName
      );
    }

    // save the Dockerfile in our temporary directory
    writeFileSync(join(this.tempWorkDir, "Dockerfile"), Dockerfile);

    // build the container
    this.imageID = buildContainer(this.tempWorkDir);

    // test against hidden and sample or sample only based on testcase type
    if (this.testcaseType === "full") {
      // sample
      await evalTestcases(
        this.imageID,
        this.sampleTestcasesMeta,
        this.sourceCodeFileName,
        this.submission,
        join(this.testcaseDir, "sample"),
        this.memL,
        this.tL,
        this.language,
        "sample"
      );

      //hidden
      await evalTestcases(
        this.imageID,
        this.testcasesMeta,
        this.sourceCodeFileName,
        this.submission,
        join(this.testcaseDir, "hidden"),
        this.memL,
        this.tL,
        this.language,
        "hidden"
      );

      // if there is no verdict, there is a high change that there is server error
      if (
        !this.submission.sampleTestcasesVerdict ||
        !this.submission.testcasesVerdict
      ) {
        console.log("Server Error Occured!");
        this.submission.verdict = verdicts.JUDGE_SE; // server error
      } else {
        // Now find the verdict of the submission
        // test sample testcases first
        for (let verdict of this.submission.sampleTestcasesVerdict) {
          if (verdict !== verdicts.JUDGE_AC) {
            this.submission.verdict = verdict;
            await this.submission.save();
            return;
          }
        }
        this.submission.verdict = verdicts.JUDGE_AC;
        await this.submission.save();
        return;
      }
    } else {
      // sample
      await evalTestcases(
        this.imageID,
        this.sampleTestcasesMeta,
        this.sourceCodeFileName,
        this.submission,
        join(this.testcaseDir, "sample"),
        this.memL,
        this.tL,
        this.language,
        this.testcaseType
      );
    }
  }
}
