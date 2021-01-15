import { languageInf } from "./types";

export const languages: languageInf[] = [
  {
    name: "C",
    compiled: true,
    dockerImage: "gcc",
    extension: ".c",
    getCompileCMD: (fileName) => {
      return `gcc ${fileName}`;
    },
    getRunCMD: () => {
      return "./a.out";
    },
  },
  {
    name: "C++",
    compiled: true,
    dockerImage: "gcc",
    extension: ".cpp",
    getCompileCMD: (fileName) => {
      return `g++ ${fileName}`;
    },
    getRunCMD: () => {
      return "./a.out";
    },
  },
  {
    name: "Python",
    compiled: false,
    dockerImage: "python",
    extension: ".py",
    getRunCMD: (fileName) => {
      return `python ${fileName}`;
    },
  },
  {
    name: "Java",
    compiled: false,
    dockerImage: "openjdk",
    extension: ".java",
    getRunCMD: (fileName) => {
      return `java ${fileName} 2> /dev/null`;
    },
  },
  {
    name: "Javascript",
    compiled: false,
    dockerImage: "node",
    extension: ".js",
    getRunCMD: (fileName) => {
      return `node ${fileName}`;
    },
  },
  {
    name: "Typescript",
    compiled: true,
    dockerImage: "node",
    extension: ".ts",
    compiledExtension: ".js",
    getCompileCMD: (fileName) => {
      return `npm i -g typescript && tsc ${fileName}`;
    },
    getRunCMD: (fileName) => {
      return `node ${fileName}`;
    },
  },
  {
    name: "Go",
    compiled: false,
    dockerImage: "golang",
    extension: ".go",
    getRunCMD: (fileName) => {
      return `go ${fileName}`
    },
  },
];
