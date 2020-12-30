import { join } from "path";
import { DocumentType, getModelForClass } from "@typegoose/typegoose";
import { tmpdir } from "os";
import { Problem } from "../../../../src/models/Problem";
import { Submission } from "../../../../src/models/Submission";
import { Judging_Job } from "./classes/job";
import { downloader } from "./downloader/downloader";
import { verdicts } from "./verdicts";
import { v4 } from "uuid";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "fs";
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

  getSubmission() {
    return this.submission;
  }

  async downloadTestcases() {
    let problem = await getModelForClass(Problem).findOne({
      problemId: this.job.problemId,
    });
    if (!problem) {
      throw new Error("Problem does not exists!");
    }
    let rval = await downloader(problem, this.containerDir);

    if (rval.success && rval.dir) {
      this.testcasesFolder = rval.dir;
    } else {
      throw new Error(`${rval.reason}`);
    }
  }

  createContainer() {
    let tworkdir = mkdtempSync(join(tmpdir(), v4()));
    // create folders for testcases
    mkdirSync(join(tworkdir, "sample"));
    mkdirSync(join(tworkdir, "hidden"));

    // save the code in a file
    try {
      writeFileSync(
        join(tworkdir, this.job.fileName + this.job.languageObj.extension),
        this.job.code
      );
    } catch (e) {
      console.log(e, e.stack);
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
    let command = `docker build ${this.containerDir}`;
    try {
      let output = execSync(command).toString();
      console.log(output);

      let lines = output.split("\n");
      let containerIdLine = lines[lines.length - 2].split(" ");
      let containerId = containerIdLine[containerIdLine.length - 1];

      this.containerId = containerId;
      console.log(this.submission);
      console.log(output);
    } catch {
      this.job.verdict = verdicts.JUDGE_COMPILE_ERROR;
      this.submission.verdict = verdicts.JUDGE_COMPILE_ERROR;
      this.submission.save();
      return false;
    }
    return true;
  }

  runContainer(
    inputFile: string,
    outputFile: string,
    testcasesPrefix: "sample" | "hidden"
  ) {
    let command = `docker run --memory=${this.job.memoryLimit}m ${
      this.containerId
    } ${this.job.languageObj.getRunCommand(this.job.fileName)}`;

    this.submission.verdict = verdicts.JUDGE_TESTING;
    this.job.verdict = verdicts.JUDGE_TESTING;
    console.log(command);
    let process = exec(command, (err, stdout, stderr) => {
      console.log(stdout, err, stderr);
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
          join(this.testcasesFolder, testcasesPrefix, outputFile)
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
      join(this.testcasesFolder, testcasesPrefix, inputFile)
    );
    process.stdin?.write(inputData);

    // let timeout = setTimeout(() => {
    //   process.kill();
    //   this.submission.verdict = verdicts.JUDGE_CPU_LIMIT_EXCEEDED;
    //   this.job.verdict = verdicts.JUDGE_CPU_LIMIT_EXCEEDED;
    //   this.submission.save();
    // }, this.job.timeLimit);

    // process.on("exit", () => {
    //   clearTimeout(timeout);
    //   console.log("stopping killer...");
    // });
    // process.on("error", () => {
    //   clearTimeout(timeout);
    //   console.log("stopping killer...");
    // });
    // process.on("close", () => {
    //   clearTimeout(timeout);
    //   console.log("stopping killer...");
    // });
  }
}
