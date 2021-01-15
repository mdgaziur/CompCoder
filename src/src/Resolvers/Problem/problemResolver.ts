import { UserInputError } from "apollo-server";
import { getModelForClass } from "@typegoose/typegoose";
import { Problem } from "./../../models/Problem";
import { Arg, Mutation, Resolver } from "type-graphql";
import constants from "../../constants";

@Resolver()
export class problemResolver {
  @Mutation(() => Boolean)
  async editProblem(
    @Arg("title", () => String, { nullable: true }) title: string,
    @Arg("description", () => String, { nullable: true })
    description: string,
    @Arg("memoryLimit", () => Number, { nullable: true }) memoryLimit: number,
    @Arg("timeLimit", () => Number, { nullable: true }) timeLimit: number,
    @Arg("availableLangs", () => [Number], { nullable: true })
    availableLangs: number[],
    @Arg("problemId", () => String, { nullable: true }) problemId: string,
    @Arg("overview", () => String, { nullable: true }) overview: string
  ) {
    let problem = await getModelForClass(Problem).findOne({
      _id: problemId,
    });

    if (!problem) {
      throw new UserInputError("Problem does not exists", {
        inputArgs: ["problemId"],
      });
    }

    if (title) {
      if (title.length > 50) {
        throw new UserInputError("Too big title!", {
          inputArgs: ["title"],
        });
      } else if (title.length < 5) {
        throw new UserInputError("Too small title!", {
          inputArgs: ["title"],
        });
      }
      problem.title = title;
    }
    if (description) {
      // check if thats valid
      problem.description = description.toString();
    }
    if (memoryLimit) {
      if (memoryLimit > constants.MAX_MEMORY_LIMIT) {
        throw new UserInputError("Memory limit is too large!", {
          inputArgs: ["memoryLimit"],
        });
      } else if (memoryLimit < constants.MIN_MEMORY_LIMIT) {
        throw new UserInputError("Memory limit is too low!", {
          inputArgs: ["memoryLimit"],
        });
      }
      problem.memoryLimit = memoryLimit;
    }
    if (timeLimit) {
      if (timeLimit > constants.MAX_TIME_LIMIT) {
        throw new UserInputError("Time is too large!", {
          inputArgs: ["timeLimit"],
        });
      } else if (timeLimit < constants.MIN_TIME_LIMIT) {
        throw new UserInputError("Time limit is too low!", {
          inputArgs: ["timeLimit"],
        });
      }
      problem.timeLimit = timeLimit;
    }
    if (availableLangs) {
      availableLangs.forEach((languageId) => {
        if (languageId > 7 || languageId < 1) {
          throw new UserInputError("Invalid language", {
            inputArgs: ["availableLangs"],
          });
        }
      });
      problem.availableLangs = availableLangs;
    }

    if (overview) {
      if (overview.split(" ").length < 10 || overview.split(" ").length > 50) {
        throw new UserInputError("Too big or small overview!", {
          inputArgs: ["overview"],
        });
      }
      problem.overview = overview;
    }
    await problem.save();
    return true;
  }
}
