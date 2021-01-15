import { User } from "./../models/User";
import { languages } from "./language";
import { DocumentType, getModelForClass } from "@typegoose/typegoose";
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

async function isACSubmission(submissionId: any) {
  let submission = await getModelForClass(Submission).findOne({
    _id: submissionId,
  });
  return submission?.verdict === verdicts.JUDGE_AC;
}

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
  public user: DocumentType<User>;

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
    testcaseType: "sample" | "full",
    user: DocumentType<User>
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
    this.user = user;
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

    if (this.testcaseType === "full") {
      // check if all sample testcases are AC
      await evalTestcases(
        this.imageID,
        this.sampleTestcasesMeta,
        this.sourceCodeFileName,
        this.submission,
        this.testcaseDir,
        this.memL,
        this.tL,
        this.language,
        "sample"
      );

      if (!this.submission.sampleTestcasesVerdict) {
        this.submission.verdict = verdicts.JUDGE_SE;
        return;
      }

      for (let verdict of this.submission.sampleTestcasesVerdict) {
        if (verdict !== verdicts.JUDGE_AC) {
          this.submission.verdict = verdict;
          await this.submission.save();
          return;
        }
      }

      // check if all hidden testcases are AC
      await evalTestcases(
        this.imageID,
        this.testcasesMeta,
        this.sourceCodeFileName,
        this.submission,
        this.testcaseDir,
        this.memL,
        this.tL,
        this.language,
        "hidden"
      );

      if (!this.submission.testcasesVerdict) {
        this.submission.verdict = verdicts.JUDGE_SE;
        return;
      }

      for (let verdict of this.submission.testcasesVerdict) {
        if (verdict !== verdicts.JUDGE_AC) {
          this.submission.verdict = verdict;
          await this.submission.save();
          return;
        }
      }
      this.submission.verdict = verdicts.JUDGE_AC;
    } else {
      // check if all sample testcases are AC
      await evalTestcases(
        this.imageID,
        this.sampleTestcasesMeta,
        this.sourceCodeFileName,
        this.submission,
        this.testcaseDir,
        this.memL,
        this.tL,
        this.language,
        "sample"
      );

      if (!this.submission.sampleTestcasesVerdict) {
        this.submission.verdict = verdicts.JUDGE_SE;
        return;
      }

      for (let verdict of this.submission.sampleTestcasesVerdict) {
        if (verdict !== verdicts.JUDGE_AC) {
          this.submission.verdict = verdict;
          await this.submission.save();
          return;
        }
      }
      this.submission.verdict = verdicts.JUDGE_AC;
    }
    if (this.submission.verdict === verdicts.JUDGE_AC) {
      let userModel = getModelForClass(User);
      let users = await userModel.find();
      users = users.sort((x, y) => {
        if (!x.Submissions) {
          return -1;
        } else if (!y.Submissions) {
          return 1;
        }
        if (x.Submissions.length > y.Submissions.length) {
          return 1;
        } else {
          return -1;
        }
      });
      if (!this.user.Submissions) {
        this.user.Submissions = [this.submission];
      }
      if (!this.user.rank || this.user.rank === -1) {
        this.user.rank = users.length;
      }
      for (let user of users) {
        if (!user.Submissions) continue;
        let acSubmissionsFromUser = user.Submissions?.filter((_id) =>
          isACSubmission(_id)
        );
        let acSubmissionsFromCurrentUser = this.user.Submissions?.filter(
          (_id) => isACSubmission(_id)
        );
        if (
          acSubmissionsFromCurrentUser.length > acSubmissionsFromUser.length
        ) {
          if (!this.user.rank) {
            continue;
          }
          this.user.rank -= 1;
          user.rank += 1;
          await this.user.save();
          await user.save();
        } else if (
          acSubmissionsFromCurrentUser.length === acSubmissionsFromUser.length
        ) {
          if (!this.user.rank) {
            continue;
          }
          this.user.rank -= 1;
          user.rank += 1;
          await this.user.save();
          await user.save();
        } else {
          break;
        }
      }
    }
    await this.submission.save();
  }
}
