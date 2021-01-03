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
    @Arg("memoryLimit", () => Number) memoryLimit: number,
    @Arg("timeLimit", () => Number) timeLimit: number,
    @Arg("availableLangs", () => [Number]) availableLangs: number[]
  ) {
    let user: DocumentType<User> = context.user;
    let problemModel = getModelForClass(Problem);

    let titleIsUnique = await isUniqueField(title, "title", problemModel);

    if (!titleIsUnique) {
      throw new UserInputError("Problem title must be unique!", {
        inputArgs: ["title"],
      });
    }
    if (memoryLimit < 100 || memoryLimit > 1024) {
      throw new UserInputError("Memory limit out of range!", {
        inputArgs: ["memoryLimit"],
      });
    }

    if (timeLimit < 100 || timeLimit > 5000) {
      throw new UserInputError("CPU limit out of range!", {
        inputArgs: ["timeLimit"],
      });
    }

    for (let langID of availableLangs) {
      if (langID < 1 || langID > 7) {
        throw new UserInputError("Invalid language id!", {
          inputArgs: ["availableLangs"],
        });
      }
    }

    if (availableLangs.length < 1 || availableLangs.length > 7) {
      throw new UserInputError("Too many or too few language ids", {
        inputArgs: ["availableLangs"],
      });
    }

    let problem = await problemModel.create({
      problemId: v4().toString(),
      title: title,
      description: description,
      availableLangs: availableLangs,
      author: user._id,
      timeLimit: timeLimit,
      memoryLimit: memoryLimit,
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
