/**
 * Generates Dockerfile
 *
 * @param {string} dockerImage Docker Image
 * @param {string} workdir Working directory of docker container
 * @param {string} runCommand Command which will be ran in build time
 * @returns {string} A string containing the contents of the generated Dockerfile
 */
export function dockergen(
  dockerImage: string,
  workdir: string,
  sourceCodeFileName: string,
  runCommand?: string
): string {
  let from = `FROM ${dockerImage}:latest\n`;
  let workDir = `WORKDIR ${workdir}\n`;
  let copy = `COPY ${sourceCodeFileName} ${workdir}\n`;
  let run: string;

  if (runCommand) {
    run = `RUN ${runCommand}\n`;

    return from + workDir + copy + run;
  }

  return from + workDir + copy;
}
