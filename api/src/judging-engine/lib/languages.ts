export interface language {
  name: string;
  id: number;
  compiled: boolean;
  dockerContainer: string;
  getCompileCommand: (fileName: string) => string;
  getRunCommand: (fileName: string) => string;
  extension: string;
}

export const languages = [
  {
    name: "C",
    id: 1,
    compiled: true,
    dockerContainer: "gcc",
    getCompileCommand: (fileName: string) => {
      return `gcc ${fileName}.c`;
    },
    getRunCommand: (fileName: string) => {
      return `./${fileName}`;
    },
    extension: ".c",
  },
  {
    name: "C++",
    id: 2,
    compiled: true,
    dockerContainer: "gcc",
    getCompileCommand: (fileName: string) => {
      return `g++ ${fileName}.cpp`;
    },
    getRunCommand: (fileName: string) => {
      return `./${fileName}`;
    },
    extension: ".cpp",
  },
  {
    name: "Python",
    id: 3,
    compiled: false,
    dockerContainer: "python",
    getRunCommand: (fileName: string) => {
      return `python ${fileName}.py`;
    },
    extension: ".py",
  },
  {
    name: "Java",
    id: 4,
    compiled: false,
    dockerContainer: "openjdk",
    getRunCommand: (fileName: string) => {
      return `java ${fileName}.java 2> /dev/null`;
    },
    extension: ".java",
  },
  {
    name: "Javascript",
    id: 5,
    compiled: false,
    dockerContainer: "node",
    getRunCommand: (fileName: string) => {
      return `node ${fileName}.js`;
    },
    extension: ".js",
  },
  {
    name: "Typescript",
    id: 6,
    compiled: true,
    dockerContainer: "node",
    getCompileCommand: (fileName: string) => {
      return `npm i -g typescript && tsc ${fileName}.ts`;
    },
    getRunCommand: (fileName: string) => {
      return `node ${fileName}.js`;
    },
    extension: ".ts",
  },
  {
    name: "Go",
    id: 7,
    compiled: false,
    dockerContainer: "golang",
    getRunCommand: (fileName: string) => {
      return `go run ${fileName}.go`;
    },
    extension: ".go",
  },
];
