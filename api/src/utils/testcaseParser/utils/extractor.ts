import { errorCodes } from '../../../errorCodes';
import JSZip from 'jszip';
import { returnType } from './../types';
import { S3 } from 'ibm-cos-sdk';
import { mkdirSync, writeFileSync } from 'fs';

function createTextFile(bucketName: string, itemName: string, fileText: string, cos: S3): Promise<boolean> {
    return new Promise((res, rej) => {
        cos.putObject({
            Bucket: bucketName,
            Key: itemName,
            Body: fileText
        }).promise().then(() => {
            res(true);
        }).catch(e => {
            console.log(e, e.stack);
            rej(false);
        })
    });
}

function removeTextFile(bucketName: string, itemName: string, cos: S3): Promise<boolean> {
    return new Promise((res, rej) => {
        cos.deleteObject({
            Bucket: bucketName,
            Key: itemName
        }).promise().then(() => {
            res(true);
        }).catch(e => {
            console.log(e, e.stack);
            rej(false);
        })
    });
}


export async function extractZip(zip: Buffer, problemID: string): Promise<returnType> {
    let jszip = new JSZip();
    let zipFile = await jszip.loadAsync(zip);

    // To upload files to IBM Cloud Bucket
    let cos: S3;

    let files = Object.keys(zipFile.files);

    // Write files to IBM CLOUD OBJECT if the program is running in production mode
    if (process.env.NODE_ENV === 'production') {
        let config = {
            endpoint: "s3.eu-gb.cloud-object-storage.appdomain.cloud",
            apiKeyId: process.env.IBM_CLOUD_TESTCASES_BUCKET_API_KEY || "",
            serviceInstanceId: "crn:v1:bluemix:public:cloud-object-storage:global:a/0756d7dc8b5a41d8914823fffc27d0e4:8d39aadb-5e20-4340-88f0-d8406a523b18::"
        }

        cos = new S3(config);

        for (let file of files) {
            let testCaseFile = zipFile.file(file);
            if (!testCaseFile) {
                return {
                    success: false,
                    reason: errorCodes.INVALID_ZIP
                }
            }

            let testcaseData = await testCaseFile.async("string");
            try {
                await createTextFile("intellect-judge-testcases-data", `${problemID}/`+file, testcaseData, cos);
            } catch {
                for(let f of files) {
                    await removeTextFile("intellect-judge-testcases-data", `${problemID}/`+f, cos);
                }
            }
        }

    } else {
        try {
            mkdirSync(`files`);
        } catch(e) {
            console.log(e, e.stack);
        }
        try {
            mkdirSync(`files/${problemID}`);
        } catch(e) {
            console.log(e, e.stack);
        }

        for (let file of files) {
            let testCaseFile = zipFile.file(file);
            writeFileSync(`files/${problemID}/${file}`, await testCaseFile?.async("string") || "");
        }
    }

    return {
        success: true
    }
}
