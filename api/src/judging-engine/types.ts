export type testcaseMetaType = {
  input: string;
  output: string;
};

export type languageInf = {
  name: string;
  getCompileCMD?: (fileName: string) => string;
  getRunCMD: (fileName: string) => string;
  dockerImage: string;
  compiled: Boolean;
  compiledExtension?: string;
  extension: string;
};
