import { testcaseMetaType } from "./../../../judging-engine/types";
import { errorCodes } from "./../../../errorCodes";
import { returnType } from "./../types";
import JSZip from "jszip";

// https://stackoverflow.com/questions/10225399/check-if-a-file-is-binary-or-ascii-with-node-js
function IsAscii(data: string) {
  var isAscii = true;
  for (var i = 0, len = data.length; i < len; i++) {
    if (data.charCodeAt(i) > 127) {
      isAscii = false;
      break;
    }
  }
  return isAscii;
}

function findWithRegex(arr: Array<string>, regex: RegExp): string | null {
  for (let i of arr) {
    if (regex.test(i)) {
      return i;
    }
  }
  return null;
}

export async function validateTestcasesFile(file: Buffer): Promise<returnType> {
  const jszip = new JSZip();

  try {
    var zipFile = await jszip.loadAsync(file);
  } catch (e) {
    return {
      success: false,
      reason: errorCodes.INVALID_ZIP,
    };
  }
  let fileNames = Object.keys(zipFile.files);

  if (fileNames.length === 0) {
    return {
      success: false,
      reason: errorCodes.EMPTY_ZIP,
    };
  }

  // Make sure there is no files other than testcases
  for (let file of fileNames) {
    if (!/[0-9]\.(\w+)\.in/.test(file) && !/[0-9]\.(\w+)\.out/.test(file)) {
      return {
        success: false,
        reason: errorCodes.FILE_NOT_ALLOWED,
      };
    }
  }

  // Make sure all the files have valid index and there is one output file for an input file
  let idx = 1;
  let requiredMatches = fileNames.length / 2;
  let testcasesMeta: testcaseMetaType[] = [];

  while (idx <= requiredMatches) {
    let inputFileRegex = new RegExp(`${idx}\\.(\\w+)\\.in`);
    let outputFileRegex = new RegExp(`${idx}\\.(\\w+)\\.out`);

    let inputFile = findWithRegex(fileNames, inputFileRegex);
    let outputFile = findWithRegex(fileNames, outputFileRegex);

    if (!inputFile || !outputFile) {
      return {
        success: false,
        reason: errorCodes.TESTCASEFILE_MISMATCH,
      };
    } else {
      // Check that all the files are text files
      if (
        !IsAscii((await zipFile.file(inputFile)?.async("string")) || "") ||
        !IsAscii((await zipFile.file(outputFile)?.async("string")) || "")
      ) {
        return {
          success: false,
          reason: errorCodes.INVALID_FILE_TYPE,
        };
      }
    }
    idx++;
    testcasesMeta.push({
      input: inputFile,
      output: outputFile,
    });
  }
  return {
    success: true,
    meta: testcasesMeta,
  };
}
