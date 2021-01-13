import { ObjectId } from "mongodb";
import { testcaseMetaType } from "./../judging-engine/types";
import { Submission } from "./Submission";
import { User } from "./User";
import { Ref, prop, Index } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Index({
  title: "text",
})
export class Problem {
  @Field(() => String, { nullable: true })
  readonly _id: ObjectId;

  @prop({
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  })
  @Field({ nullable: true })
  public title: string;

  @prop({
    required: true,
  })
  @Field({ nullable: true })
  public slug: string;

  @prop({
    required: true,
  })
  @Field({ nullable: true })
  public overview: string;

  @prop({
    required: true,
  })
  @Field(() => String, { nullable: true })
  public description: String;

  @prop({
    ref: "User",
    required: true,
  })
  @Field(() => String, { nullable: true })
  public author: Ref<User>;

  @prop({
    required: true,
    default: false,
  })
  @Field({ nullable: true })
  public approved?: Boolean;

  @prop({
    required: true,
  })
  @Field(() => [Number], { nullable: true })
  public availableLangs: number[];

  @prop({
    required: true,
    default: new Date(),
  })
  @Field({ nullable: true })
  public dateCreated?: Date;

  @prop({
    required: true,
  })
  @Field({ nullable: true })
  public memoryLimit: number;

  @prop({
    required: true,
  })
  @Field({ nullable: true })
  public timeLimit: number;

  @prop({
    required: true,
  })
  public sampleTestcasesMeta?: testcaseMetaType[];

  @prop()
  public testcasesMeta?: testcaseMetaType[];

  @prop({
    ref: "Submission",
  })
  @Field(() => [String], { nullable: true })
  public Submissions?: Ref<Submission>[];
}
