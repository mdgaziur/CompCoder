import { returnType } from "./types";
import { extractZip } from "./utils/extractor";
import { validateTestcasesFile } from "./utils/validator";

export async function validateAndExtractTestcaseZipFile(
  fileBuffer: Buffer,
  problemId: string,
  testcaseType: number
): Promise<returnType> {
  let { success, reason, meta } = await validateTestcasesFile(fileBuffer);

  if (!success) {
    return {
      success: false,
      reason: reason,
    };
  } else {
    let { success, reason } = await extractZip(
      fileBuffer,
      problemId,
      testcaseType
    );
    if (!success) {
      return {
        success,
        reason,
      };
    } else {
      return {
        success: true,
        meta: meta,
      };
    }
  }
}
