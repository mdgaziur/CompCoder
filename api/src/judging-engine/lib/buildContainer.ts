import { execSync } from "child_process";

/**
 * Builds container and returns Image ID
 * @param {string} containerDir Directory containing files for the container
 * @returns {string} String containing the Image ID of the container
 */
export function buildContainer(containerDir: string): string {
  let output = execSync(`docker build ${containerDir}`);

  /*
      Docker outputs the container ID on the last line.
      The Image ID is the last word of that line
    */
  let lines = output.toString().split("\n");
  let lastLine = lines[lines.length - 2].split(" ");
  let imageID = lastLine[lastLine.length - 1];

  return imageID;
}
