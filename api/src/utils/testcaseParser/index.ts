import { returnType } from './types';
import { extractZip } from './utils/extractor';
import { validateTestcasesFile } from './utils/validator';

export async function validateAndExtractTestcaseZipFile(fileBuffer: Buffer, problemID: string):Promise<returnType> {

    let { success, reason, meta } = await validateTestcasesFile(fileBuffer);

    if(!success) {
        return {
            success: false,
            reason: reason
        }
    } else {
        let { success, reason } = await extractZip(fileBuffer, problemID);
        if(!success) {
            return {
                success,
                reason
            }
        } else {
            return {
                success: true,
                meta: meta
            }
        }
    }
}