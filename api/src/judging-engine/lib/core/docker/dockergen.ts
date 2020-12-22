import { language } from "../../languages";

export function dockergen(
  languageObj: language,
  fileName: string,
  workDir: string
) {
  let languageDockerContainer = languageObj.dockerContainer;

  let from = `FROM ${languageDockerContainer}`;
  let workdir = `WORKDIR ${workDir}`;
  let copy = `COPY ${fileName} ${workDir}`;

  if (languageObj.compiled && languageObj.getCompileCommand) {
    let compile = `RUN ${languageObj.getCompileCommand(fileName)}`;
    let run = `CMD ['${languageObj.getRunCommand(fileName)}']`;

    let dockerFileContent =
      from + "\n" + workdir + "\n" + copy + "\n" + compile + "\n" + run;

    return dockerFileContent;
  } else {
    let run = `CMD ['${languageObj.getRunCommand(fileName)}']`;

    let dockerFileContent = from + "\n" + workdir + "\n" + copy + "\n" + run;

    return dockerFileContent;
  }
}
