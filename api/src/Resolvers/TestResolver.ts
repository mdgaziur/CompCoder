import { User } from "../models/User";
import { Query, Resolver } from "type-graphql";
import { getModelForClass } from "@typegoose/typegoose";

@Resolver()
export class Test {
  @Query(() => String)
  hello() {
    return "Hello Hi";
  }
  @Query(() => [User])
  async user_db() {
    let userModel = getModelForClass(User);
    return userModel.find();
  }
}
