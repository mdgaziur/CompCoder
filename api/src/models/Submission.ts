import { ObjectId } from "mongodb";
import { User } from "./User";
import { prop, Ref } from "@typegoose/typegoose";
import { ObjectType, Field } from "type-graphql";
import { Problem } from "./Problem";

@ObjectType()
export class Submission {
  @Field(() => String)
  readonly _id: ObjectId;

  @prop({
    required: true,
    ref: Problem,
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
  public language: number;

  @prop({
    required: true,
  })
  @Field()
  public verdict: number;

  @prop({
    required: false,
  })
  @Field(() => [Number])
  public testcasesVerdict?: number[];

  @prop()
  @Field(() => [String], { nullable: true })
  public runtimeOutputs?: string[];

  @prop()
  @Field(() => [Number])
  public sampleTestcasesVerdict?: number[];

  @prop({
    required: true,
  })
  @Field(() => Boolean)
  public isSampleSubmission: Boolean;
}
