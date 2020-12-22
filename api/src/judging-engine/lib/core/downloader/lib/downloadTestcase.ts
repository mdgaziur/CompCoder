import { S3 } from "ibm-cos-sdk";

export function downloadTestcase(
  type: string,
  problemId: string,
  testcaseId: string,
  cos: S3
) {
  return new Promise((res, rej) => {
    cos
      .getObject({
        Bucket: "compcoder-testcases",
        Key: `${problemId}/${type}/${testcaseId}`,
      })
      .promise()
      .then((val) => {
        res(val);
      })
      .catch(err => {
        rej(err);
      });
  });
}
