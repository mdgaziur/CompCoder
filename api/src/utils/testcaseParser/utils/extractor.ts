import { errorCodes } from "../../../errorCodes";
import JSZip from "jszip";
import { returnType } from "./../types";
import { S3 } from "ibm-cos-sdk";
import { mkdirSync, writeFileSync } from "fs";

function createTextFile(
  bucketName: string,
  itemName: string,
  fileText: string,
  cos: S3
): Promise<boolean> {
  return new Promise((res, rej) => {
    cos
      .putObject({
        Bucket: bucketName,
        Key: itemName,
        Body: fileText,
      })
      .promise()
      .then(() => {
        res(true);
      })
      .catch((e) => {
        console.log(e, e.stack);
        rej(false);
      });
  });
}

function removeTextFile(
  bucketName: string,
  itemName: string,
  cos: S3
): Promise<boolean> {
  return new Promise((res, rej) => {
    cos
      .deleteObject({
        Bucket: bucketName,
        Key: itemName,
      })
      .promise()
      .then(() => {
        res(true);
      })
      .catch((e) => {
        console.log(e, e.stack);
        rej(false);
      });
  });
}

export async function extractZip(
  zip: Buffer,
  problemID: string,
  testcaseType: number
): Promise<returnType> {
  let jszip = new JSZip();
  let zipFile = await jszip.loadAsync(zip);

  // To upload files to IBM Cloud Bucket
  let cos: S3;

  let files = Object.keys(zipFile.files);

  // Write files to IBM CLOUD OBJECT if the program is running in production mode
  if (process.env.NODE_ENV === "production") {
    let config = {
      endpoint: "s3.eu-gb.cloud-object-storage.appdomain.cloud",
      apiKeyId: process.env.IBM_CLOUD_TESTCASES_BUCKET_API_KEY || "",
      serviceInstanceId: process.env.IBM_CLOUD_INSTANCE_KEY || "",
    };

    cos = new S3(config);

    for (let file of files) {
      let testCaseFile = zipFile.file(file);
      if (!testCaseFile) {
        return {
          success: false,
          reason: errorCodes.INVALID_ZIP,
        };
      }

      let testcaseData = await testCaseFile.async("string");
      let prefix = testcaseType === 0 ? "sample" : "hidden";
      try {
        await createTextFile(
          "compcoder-testcases",
          `${problemID}/${prefix}/` + file,
          testcaseData,
          cos
        );
      } catch (e) {
        try {
          for (let f of files) {
            await removeTextFile(
              "compcoder-testcases",
              `${problemID}/${prefix}/` + f,
              cos
            );
          }
        } catch {}
        return {
          success: false,
        };
      }
    }
  } else {
    let prefix = testcaseType === 0 ? "sample" : "hidden";
    try {
      mkdirSync(`files`);
    } catch (e) {
      console.log(e, e.stack);
    }
    try {
      mkdirSync(`files/${problemID}/`);
    } catch (e) {
      console.log(e, e.stack);
    }

    try {
      mkdirSync(`files/${problemID}/${prefix}`);
    } catch (e) {
      console.log(e, e.stack);
    }

    for (let file of files) {
      let testCaseFile = zipFile.file(file);
      writeFileSync(
        `files/${problemID}/${prefix}/${file}`,
        (await testCaseFile?.async("string")) || ""
      );
    }
    return {
      success: true,
    };
  }
  return {
    success: false,
  };
}
