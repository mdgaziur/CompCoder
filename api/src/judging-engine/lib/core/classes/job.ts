import { v4 } from "uuid";
import { language, languages } from "./../../languages";

export class Judging_Job {
  public memoryLimit: number; // mb
  public timeLimit: number; // ms
  public problemId: string; // problem id to get testcases
  public code: string; // source code
  public compiled: Boolean; // Indicating if it's compiled

  public verdict: number;
  public languageObj: language;
  public fileName: string;

  constructor(
    languageId: number,
    memoryLimit: number,
    timeLimit: number,
    problemId: string,
    code: string
  ) {
    this.memoryLimit = memoryLimit;
    this.timeLimit = timeLimit;
    this.problemId = problemId;
    this.code = code;

    let languageObj = languages[languageId - 1];
    if (!languageObj) {
      throw new Error("Unknown language id!");
    }

    this.languageObj = languageObj;
    this.compiled = languageObj.compiled;
    this.fileName = v4();
  }

  updateVerdict(verdict: number) {
    this.verdict = verdict;
  }
}
