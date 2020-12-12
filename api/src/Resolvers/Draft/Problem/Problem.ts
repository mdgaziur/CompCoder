import { getModelForClass } from "@typegoose/typegoose";
import { Problem } from "./../../../models/Problem";
import { DocumentType } from "@typegoose/typegoose";
import { UserInputError } from "apollo-server";
import { isUniqueField } from "../../../utils/isUniqueField";
import { Arg, Ctx, Mutation, Resolver, Authorized } from "type-graphql";
import { User } from "../../../models/User";
import { v4 } from "uuid";

@Resolver()
export class ProblemResolver {
  @Authorized()
  @Mutation(() => Problem)
  async createProblem(
    @Ctx() context: any,
    @Arg("title", () => String) title: string,
    @Arg("description", () => String) description: String,
    @Arg("availableLangs", () => [String]) availableLangs: string[]
  ) {
    let user: DocumentType<User> = context.user;
    let problemModel = getModelForClass(Problem);

    let titleIsUnique = await isUniqueField(title, "title", problemModel);

    if (!titleIsUnique) {
      throw new UserInputError("Problem title must be unique!", {
        inputArgs: ["title"],
      });
    } else {
      let problem = await problemModel.create({
        problemId: v4().toString(),
        title: title,
        description: description,
        availableLangs: availableLangs,
        author: user._id,
      });
      if (!user.createdProblems) {
        user.createdProblems = [problem._id];
      } else {
        user.createdProblems.push(problem._id);
      }
      user.save();
      return problem;
    }
  }
}
