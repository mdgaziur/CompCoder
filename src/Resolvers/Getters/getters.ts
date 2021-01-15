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
@ObjectType()
class paginatedSubmissions {
  @Field()
  public pages: number;

  @Field(() => [Submission])
  public items: Submission[];
}

@ObjectType()
class SearchResults {
  @Field(() => [Problem])
  public problems: Problem[];

  @Field(() => [User])
  public users: User[];
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
  ): Promise<paginatedProblems> {
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

  // get submissions
  @Query(() => paginatedSubmissions)
  async getSubmissions(
    @Arg("page", () => Number, { nullable: true }) page: number,
    @Arg("itemsPerPage", () => Number, { nullable: true }) itemsPerPage: number
  ): Promise<paginatedSubmissions> {
    if (!page || !itemsPerPage) {
      page = 1;
      itemsPerPage = 5;
    }
    let submissionModel = getModelForClass(Submission);
    let submissions = await submissionModel.find();

    // paginate
    let offset = (page - 1) * itemsPerPage;
    let paginatedItems = submissions.slice(offset).slice(0, itemsPerPage);
    let totalPages = Math.ceil(paginatedItems.length / itemsPerPage);

    let paginated = new paginatedSubmissions();
    paginated.items = paginatedItems;
    paginated.pages = totalPages;

    return paginated;
  }

  // get submissions with filters
  @Query(() => paginatedSubmissions)
  async getFilteredSubmissions(
    @Arg("page", () => Number, { nullable: true }) page: number,
    @Arg("itemsPerPage", () => Number, { nullable: true }) itemsPerPage: number,
    @Arg("author", () => String, { nullable: true }) author: string,
    @Arg("problem", () => String, { nullable: true }) problem: string,
    @Arg("verdict", () => Number, { nullable: true }) verdict: number,
    @Arg("language", () => Number, { nullable: true }) language: number
  ): Promise<paginatedSubmissions> {
    if (!page || !itemsPerPage) {
      page = 1;
      itemsPerPage = 5;
    }
    let query = {};
    if (author) query["author"] = author;
    if (problem) query["problem"] = problem;
    if (verdict) query["verdict"] = verdict;
    if (language) query["language"] = language;

    let submissions = await getModelForClass(Submission).find(query);

    // paginate
    let offset = (page - 1) * itemsPerPage;
    let paginatedItems = submissions.slice(offset).slice(0, itemsPerPage);
    let totalPages = Math.ceil(paginatedItems.length / itemsPerPage);

    let paginated = new paginatedSubmissions();
    paginated.items = paginatedItems;
    paginated.pages = totalPages;

    return paginated;
  }

  @Query(() => paginatedProblems)
  async getFilteredProblems(
    @Arg("page", () => Number, { nullable: true }) page: number,
    @Arg("itemsPerPage", () => Number, { nullable: true }) itemsPerPage: number,
    @Arg("author", () => String, { nullable: true }) author: string,
    @Arg("problemId", () => String, { nullable: true }) problemId: string
  ) {
    if (!page || !itemsPerPage) {
      page = 1;
      itemsPerPage = 5;
    }

    let query = {};
    if (author) query["author"] = author;
    if (problemId) query["problemId"] = problemId;

    let problems = await getModelForClass(Problem).find(query);

    // paginate
    let offset = (page - 1) * itemsPerPage;
    let paginatedItems = problems.slice(offset).slice(0, itemsPerPage);
    let totalPages = Math.ceil(paginatedItems.length / itemsPerPage);

    let paginated = new paginatedProblems();
    paginated.items = paginatedItems;
    paginated.pages = totalPages;

    return paginated;
  }

  // search
  @Query(() => SearchResults)
  async search(@Arg("query", () => String) query: string) {
    // get all the models
    let problemModel = getModelForClass(Problem);
    let userModel = getModelForClass(User);

    let problems = await problemModel.find({
      $text: {
        $search: query,
        $caseSensitive: false,
        $diacriticSensitive: false,
      },
    });
    let users = await userModel.find({
      $text: {
        $search: query,
        $caseSensitive: false,
        $diacriticSensitive: false,
      },
    });

    return {
      problems: problems,
      users: users,
    };
  }
}
