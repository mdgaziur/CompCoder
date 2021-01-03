import { testcaseMetaType } from "./../../judging-engine/types";
import { writeFileSync } from "fs";
import { S3 } from "ibm-cos-sdk";
import { join } from "path";

/**
 * Fetch the data of the file and return
 *
 * @param {string} cos COS object
 * @param {string} key Key of the file to retrieve
 *
 * @return {string}
 */
function download(cos: S3, key: string): Promise<string> {
  return new Promise((res, rej) => {
    cos
      .getObject({
        Bucket: "compcoder-testcases",
        Key: key,
      })
      .promise()
      .then((data) => {
        res(data.toString());
      })
      .catch((reason) => {
        rej(reason);
      });
  });
}

/**
 * Downloads testcases of the specified problem and returns true if successful or false if failed
 * @param {string} problemId The problem id to get the testcases for
 * @param {string} testcasesType The testcase type
 * @param {string} downloadDir Directory where testcases will be downloaded
 * @param {string} metaData Metadata containing information about the testcase files
 *
 * @returns {Promise<Boolean>} true or false depending on success or failure
 */
export function downloadTestcases(
  problemId: string,
  testcasesType: "sample" | "hidden",
  downloadDir: string,
  metaData: testcaseMetaType[]
): Promise<Boolean> {
  return new Promise(async (res, rej) => {
    let config = {
      endpoint: "s3.eu-gb.cloud-object-storage.appdomain.cloud",
      apiKeyId: process.env.IBM_CLOUD_TESTCASES_BUCKET_API_KEY || "",
      serviceInstanceId: process.env.IBM_CLOUD_INSTANCE_KEY || "",
    };

    let cos = new S3(config);

    try {
      // iterate and download all testcases of specified type(sample or hidden)
      for (let t of metaData) {
        // download input file and save to given directory
        let testcaseKey = `${problemId}/${testcasesType}/${t.input}`;
        let testcaseData = await download(cos, testcaseKey);
        writeFileSync(join(downloadDir, t.input), testcaseData);

        // download output file and save to given directory
        testcaseKey = `${problemId}/${testcasesType}/${t.output}`;
        testcaseData = await download(cos, testcaseKey);
        writeFileSync(join(downloadDir, t.output), testcaseData);
      }
    } catch (e) {
      console.log(e, e.stack);
      rej(false);
      return;
    }
    res(true);
  });
}

/**
 * Returns the uuid file of the testcases
 * @param {string} problemId Problem id of the testcases
 */
export function downloadTestcasesUUID(problemId: string): Promise<string> {
  return new Promise(async (res, rej) => {
    let config = {
      endpoint: "s3.eu-gb.cloud-object-storage.appdomain.cloud",
      apiKeyId: process.env.IBM_CLOUD_TESTCASES_BUCKET_API_KEY || "",
      serviceInstanceId: process.env.IBM_CLOUD_INSTANCE_KEY || "",
    };

    let cos = new S3(config);

    try {
      let uuidFileKey = `${problemId}/uuid.txt`;
      let data = await download(cos, uuidFileKey);
      res(data);
    } catch (e) {
      console.log(e, e.stack);
      rej(e);
    }
  });
}
