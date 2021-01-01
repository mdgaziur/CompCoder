import { User } from "./User";
import { prop, Ref } from "@typegoose/typegoose";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Submission {
  @prop({
    required: true,
  })
  @Field()
  public problem: string;

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
  public verdict: number;

  @prop({
    required: false,
  })
  @Field(() => [Number])
  public testcasesVerdict?: number[];

  @prop()
  @Field(() => [String], { nullable: true })
  public runtimeOutputs?: string[];
}
