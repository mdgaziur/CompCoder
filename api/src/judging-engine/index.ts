import { languages } from './language';
import { DocumentType } from "@typegoose/typegoose";
import { languageInf, testcaseMetaType } from "./types";
import { Submission } from "../models/Submission";

export class judgeEngine {
  public testcasesMeta: testcaseMetaType[];
  public testcaseDir: string;
  public memL: number;
  public tL: number;
  public submission: DocumentType<Submission>;
  public language: languageInf;
  public sourceCode: string;

  /**
   *
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
    testcaseDir: string,
    memL: number,
    tL: number,
    submission: DocumentType<Submission>,
    languageID: 0 | 1 | 2 | 3 | 4 | 5 | 6,
    sourceCode: string
  ) {
    this.testcasesMeta = testcasesMeta;
    this.testcaseDir = testcaseDir;
    this.memL = memL;
    this.tL = tL;
    this.submission = submission;
    this.language = languages[languageID];
    this.sourceCode = sourceCode;
  }
}
