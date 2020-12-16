import { statusCodes } from "./statusCodes";

export class judger {
  private languageID: number;
  private code: string;
  private memLimit: number;
  private cpuL: number;
  private verdict: number;

  constructor(
    languageID: number,
    code: string,
    testcase: string,
    memLimit: number,
    cpuL: number
  ) {
    this.languageID = languageID;
    this.code = code;
    this.memLimit = memLimit;
    this.cpuL = cpuL;
  }

  getVerdict() {
    if (!this.verdict) {
      return statusCodes.JUDGE_NOT_CALLED;
    } else {
      return this.verdict;
    }
  }
}
