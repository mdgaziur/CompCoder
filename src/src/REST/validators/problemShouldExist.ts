import { Problem } from "./../../models/Problem";
import { getModelForClass } from "@typegoose/typegoose";

export async function problemShouldExist(problemId: string): Promise<Boolean> {
  let problemModel = getModelForClass(Problem);
  let problem = await problemModel.findOne({
    _id: problemId,
  });

  return problem ? true : false;
}
