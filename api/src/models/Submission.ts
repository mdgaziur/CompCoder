import { ObjectId } from "mongodb";
import { User } from "./User";
import { prop, Ref } from "@typegoose/typegoose";
import { ObjectType, Field } from "type-graphql";
import { Problem } from "./Problem";

@ObjectType()
export class Submission {
  @Field(() => String, { nullable: true })
  readonly _id: ObjectId;

  @prop({
    required: true,
    ref: Problem,
  })
  @Field(() => Problem, { nullable: true })
  public problem: Ref<Problem>;

  @prop({
    ref: User,
    required: true,
  })
  @Field(() => User, { nullable: true })
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
  @Field({ nullable: true })
  public language: number;

  @prop({
    required: true,
  })
  @Field({ nullable: true })
  public verdict: number;

  @prop({
    required: false,
  })
  @Field(() => [Number], { nullable: true })
  public testcasesVerdict?: number[];

  @prop()
  @Field(() => [String], { nullable: true })
  public runtimeOutputs?: string[];

  @prop()
  @Field(() => [Number], { nullable: true })
  public sampleTestcasesVerdict?: number[];

  @prop({
    required: true,
  })
  @Field(() => Boolean, { nullable: true })
  public isSampleSubmission: Boolean;
}
