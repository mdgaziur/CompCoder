import { Submission } from "./../../models/Submission";
import { Problem } from "./../../models/Problem";
import { getModelForClass } from "@typegoose/typegoose";
import { User } from "../../models/User";
import {
  Arg,
  Authorized,
  Ctx,
  Resolver,
  Query,
  Field,
  ObjectType,
} from "type-graphql";

// type for paginated value
@ObjectType()
class paginatedProblems {
  @Field()
  public pages: number;

  @Field(() => [Problem])
  public items: Problem[];
}

@Resolver()
export class getters {
  @Query(() => User)
  async getUserByID(@Arg("id", () => String) id: string) {
    let userModel = getModelForClass(User);
    let user = await userModel.findOne({
      _id: id,
    });

    if (!user) {
      return {};
    } else {
      return user;
    }
  }

  @Authorized()
  @Query(() => User)
  async getAuthorizedUser(@Ctx("user") user: any) {
    return user;
  }

  @Query(() => Problem)
  async getProblemById(@Arg("id", () => String) problemId: string) {
    let problemModel = getModelForClass(Problem);
    let problem = await problemModel.findOne({
      _id: problemId,
    });

    if (!problem) {
      return {};
    } else {
      return problem;
    }
  }

  @Query(() => Submission)
  async getSubmissionById(@Arg("id", () => String) id: string) {
    let submissionModel = getModelForClass(Submission);
    let submission = await submissionModel.findOne({
      _id: id,
    });

    if (!submission) {
      return {};
    } else {
      return submission;
    }
  }

  // get problems
  @Query(() => paginatedProblems)
  async getProblems(
    @Arg("page", { nullable: true }) page: number,
    @Arg("itemsPerPage", { nullable: true }) itemsPerPage: number
  ) {
    if (!page || !itemsPerPage) {
      page = 1;
      itemsPerPage = 5;
    }
    let problemModel = getModelForClass(Problem);
    let problems = await problemModel.find();

    // paginate
    let offset = (page - 1) * itemsPerPage;
    let paginatedItems = problems.slice(offset).slice(0, itemsPerPage);
    let totalPages = Math.ceil(paginatedItems.length / itemsPerPage);

    let paginated = new paginatedProblems();
    paginated.items = paginatedItems;
    paginated.pages = totalPages;

    return paginated;
  }
}
