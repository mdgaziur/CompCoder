import { User } from "./User";
import { prop, Ref } from "@typegoose/typegoose";
import { Problem } from "./Problem";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Submission {
  @prop({
    ref: Problem,
    required: true,
  })
  @Field(() => Problem)
  public problem: Ref<Problem>;

  @prop({
    ref: User,
    required: true,
  })
  @Field(() => User)
  public author: Ref<User>;

  @prop({
    required: true,
  })
  public sourceFileData: string;

  @prop({
    required: true,
    default: new Date(),
  })
  public timeCreated?: Date;

  @prop({
    required: true,
  })
  @Field()
  public verdict: number;

  @prop({
    required: true,
  })
  public testcasesVerdict?: Map<string, number>;

  @prop()
  @Field()
  public runtimeOutputs?: Array<string>;
}
