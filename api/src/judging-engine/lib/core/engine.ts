import { join } from "path";
import { DocumentType, getModelForClass } from "@typegoose/typegoose";
import { tmpdir } from "os";
import { Problem } from "src/models/Problem";
import { Submission } from "src/models/Submission";
import { Judging_Job } from "./classes/job";
import { downloader } from "./downloader/downloader";
import { verdicts } from "./verdicts";
import { v4 } from "uuid";
import { mkdtempSync, readFileSync, writeFileSync } from "fs";
import { dockergen } from "./docker/dockergen";
import { exec, execSync } from "child_process";

export class compcoderJudge {
  private job: Judging_Job;
  private submissionAuthorId: string;
  private submission: DocumentType<Submission>;
  private testcasesFolder: string;
  private containerDir: string;
  private containerId: string;

  constructor(
    code: string,
    problemId: string,
    languageId: number,
    memoryLimit: number,
    cpuLimit: number,
    authorId: string
  ) {
    this.job = new Judging_Job(
      languageId,
      memoryLimit,
      cpuLimit,
      problemId,
      code
    );
    this.submissionAuthorId = authorId;
  }

  async createSubmission() {
    let submissionModel = getModelForClass(Submission);
    let submission = await submissionModel.create({
      author: this.submissionAuthorId,
      problem: this.job.problemId,
      sourceFileData: this.job.code,
      verdict: verdicts.JUDGE_IN_QUEUE,
    });

    this.submission = submission;
  }

  async downloadTestcases() {
    let problem = await getModelForClass(Problem).findOne({
      problemId: this.job.problemId,
    });
    if (!problem) {
      throw new Error("Problem does not exists!");
    }
    let rval = await downloader(problem);

    if (rval.success && rval.dir) {
      this.testcasesFolder = rval.dir;
    } else {
      throw new Error(`${rval.reason}`);
    }
  }

  createContainer() {
    let tworkdir = mkdtempSync(join(tmpdir(), v4()));

    // save the code in a file
    try {
      writeFileSync(join(tworkdir, this.job.fileName), this.job.code);
    } catch {
      throw new Error(`Unknown error!`);
    }

    let dockerfile = dockergen(
      this.job.languageObj,
      this.job.fileName,
      tworkdir
    );

    // save the dockerfile
    try {
      writeFileSync(join(tworkdir, "Dockerfile"), dockerfile);
    } catch {
      throw new Error(`Unknown error!`);
    }

    this.containerDir = tworkdir;
  }

  buildContainer() {
    let command = `docker build ${join(this.containerDir, "Dockerfile")}`;
    try {
      let output = execSync(command).toString();

      let lines = output.split("\n");
      let containerIdLine = lines[lines.length - 2];
      let containerId = containerIdLine[containerIdLine.length - 1];

      this.containerId = containerId;
    } catch {
      this.job.verdict = verdicts.JUDGE_COMPILE_ERROR;
      this.submission.verdict = verdicts.JUDGE_COMPILE_ERROR;
      this.submission.save();
      return false;
    }
    return true;
  }

  runContainer(testcaseID: string) {
    let command = `docker run -it --memory=${this.job.memoryLimit}m ${this.containerId}`;

    this.submission.verdict = verdicts.JUDGE_TESTING;
    this.job.verdict = verdicts.JUDGE_TESTING;

    let process = exec(command, (err, stdout, stderr) => {
      if (err) {
        if (err.code === 137) {
          this.submission.verdict = verdicts.JUDGE_MEMORY_LIMIT_EXCEEDED;
          this.job.verdict = verdicts.JUDGE_MEMORY_LIMIT_EXCEEDED;
        } else {
          this.submission.verdict = verdicts.JUDGE_RUNTIME_ERROR;
          this.job.verdict = verdicts.JUDGE_RUNTIME_ERROR;
          if (this.submission.runtimeOutputs) {
            this.submission.runtimeOutputs.push(stderr);
          } else {
            this.submission.runtimeOutputs = [stderr];
          }
        }
      } else {
        let testcaseData = readFileSync(
          join(this.testcasesFolder, testcaseID + ".out")
        ).toString();

        if (testcaseData === stdout) {
          this.submission.verdict = verdicts.JUDGE_ACCEPTED;
          this.job.verdict = verdicts.JUDGE_ACCEPTED;
        } else {
          this.submission.verdict = verdicts.JUDGE_WRONG_ANSWER;
          this.job.verdict = verdicts.JUDGE_ACCEPTED;
        }
      }

      this.submission.save();
    });
    let inputData = readFileSync(
      join(this.testcasesFolder, testcaseID + ".in")
    );
    process.stdin?.write(inputData);

    let timeout = setTimeout(() => {
      process.kill();
      this.submission.verdict = verdicts.JUDGE_CPU_LIMIT_EXCEEDED;
      this.job.verdict = verdicts.JUDGE_CPU_LIMIT_EXCEEDED;
      this.submission.save();
    }, this.job.timeLimit);

    process.on("exit", () => {
      clearTimeout(timeout);
    });
    process.on("error", () => {
      clearTimeout(timeout);
    });
  }
}
