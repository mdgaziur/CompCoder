import { exec } from "child_process";
import { verdicts } from "../verdicts";

/**
 * Runs a container and returns the output. Rejects if error occured
 * @param {string} imageId Image ID of the container
 * @param {string} input Input to set as stdin
 * @param {string} cmd Command to run inside the container
 * @param {number} memL Memory limit
 * @param {number} tL Time limit
 *
 * @returns String containing output or number indicating the error/verdict code
 */
export function runContainer(
  imageId: string,
  input: string,
  cmd: string,
  memL: number,
  tL: number
): Promise<string> {
  return new Promise<string>((res, rej) => {
    let command = `docker run -i --memory=${memL}m ${imageId} ${cmd}`;
    let proc = exec(command, (err, stdout) => {
      if (err) {
        if (err.code === 137) {
          rej(verdicts.JUDGE_MLE);
        } else {
          rej(verdicts.JUDGE_RE);
        }
      } else {
        res(stdout);
      }
    });

    proc.stdin?.write(input);

    let killer = setTimeout(() => {
      proc.kill();
      rej(verdicts.JUDGE_TLE);
    }, tL);

    proc.on("exit", () => {
      clearTimeout(killer);
    });
    proc.stdout?.on("data", () => clearTimeout(killer));
  });
}
