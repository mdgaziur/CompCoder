import { problemShouldExist } from "../../REST/validators/problemShouldExist";
import { judge } from "../../judging-engine/index";
import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Submission } from "../../models/Submission";

@Resolver()
export class createSubmission {
  @Authorized()
  @Mutation(() => Submission)
  async createSubmission(
    @Arg("problemId", () => String) problemId: string,
    @Arg("code", () => String) code: string,
    @Arg("languageId", () => Number) languageId: number,
    @Ctx() context: any
  ) {
    let inputErrors: any = [];
    if (languageId < 1 || languageId > 10) {
      inputErrors.append({
        field: "languageId",
        messsage: "Unknown langauge!",
      });
    }
    if (!(await problemShouldExist(problemId))) {
      inputErrors.append({
        field: "languageId",
        message: "Problem does not exists!",
      });
    }
    if (inputErrors.length > 0) {
      return inputErrors;
    }
    return await judge(problemId, code, context.user.id, languageId, "full");
  }
}
