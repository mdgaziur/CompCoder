import { testcaseMetaType } from "./../judging-engine/types";
import { Submission } from "./Submission";
import { User } from "./User";
import { Ref, prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Problem {
  @prop({
    required: true,
  })
  @Field(() => String)
  public problemId: string;

  @prop({
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  })
  @Field()
  public title: string;

  @prop({
    required: true,
  })
  @Field(() => String)
  public description: String;

  @prop({
    ref: "User",
    required: true,
  })
  @Field(() => String)
  public author: Ref<User>;

  @prop({
    required: true,
    default: false,
  })
  @Field()
  public approved?: Boolean;

  @prop({
    required: true,
  })
  @Field(() => [Number])
  public availableLangs: number[];

  @prop({
    required: true,
    default: new Date(),
  })
  @Field()
  public dateCreated?: Date;

  @prop({
    required: true,
  })
  @Field()
  public memoryLimit: number;

  @prop({
    required: true,
  })
  @Field()
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
  @Field(() => String)
  public Submissions?: Ref<Submission>[];
}
