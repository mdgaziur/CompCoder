import { language, languages } from "./../../languages";

export class Judging_Job {
  public memoryLimit: number; // mb
  public timeLimt: number; // ms
  public problemId: string; // problem id to get testcases
  public code: string; // source code
  public compiled: Boolean; // Indicating if it's compiled

  public verdict: number;
  public languageObj: language;

  constructor(
    languageId: number,
    memoryLimit: number,
    timeLimit: number,
    problemId: string,
    code: string,
    compiled: Boolean
  ) {
    this.memoryLimit = memoryLimit;
    this.timeLimt = timeLimit;
    this.problemId = problemId;
    this.code = code;
    this.compiled = compiled;

    let languageObj = languages[languageId - 1];
    if (!languageObj) {
      throw new Error("Unknown language id!");
    }

    this.languageObj = languageObj;
  }

  updateVerdict(verdict: number) {
    this.verdict = verdict;
  }
}
