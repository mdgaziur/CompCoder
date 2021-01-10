import { Index, prop, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { Submission } from "./Submission";
import { Problem } from "./Problem";
import { IsEmail, MaxLength, MinLength } from "class-validator";
import { ObjectId } from "mongodb";

export enum userTypes {
  admin = "admin",
  moderator = "moderator",
  member = "member",
}

@ObjectType()
@Index({
  firstName: "text",
  lastName: "text",
})
export class User {
  @Field(() => String, { nullable: true })
  readonly _id: ObjectId;

  @prop({
    required: true,
    minlength: 3,
    maxlength: 50,
    unique: true,
    trim: true,
  })
  @Field({ nullable: true })
  @MaxLength(50)
  @MinLength(3)
  public firstName: string;

  @prop({
    required: true,
    minlength: 3,
    maxlength: 15,
    trim: true,
  })
  @Field({ nullable: true })
  @MaxLength(10)
  @MinLength(3)
  public lastName: string;

  @prop({
    required: true,
    trim: true,
  })
  @Field({ nullable: true })
  public username: string;

  @prop({
    trim: true,
  })
  @Field({ nullable: true })
  public company?: string;

  @prop({
    required: true,
    trim: true,
  })
  @Field({ nullable: true })
  @IsEmail()
  public email: string;

  @prop({
    enum: userTypes,
    required: true,
    default: "member",
  })
  @Field({ nullable: true })
  public userType?: userTypes;

  @prop({
    trim: true,
  })
  @Field({ nullable: true })
  public address?: string;

  @prop()
  @Field({ nullable: true })
  public profilePicID?: string;

  @prop({
    required: true,
    default: new Date(),
  })
  @Field({ nullable: true })
  public dateJoined?: Date;

  @prop({
    required: true,
    default: -1,
  })
  @Field({ nullable: true })
  public rank?: number;

  @prop({
    required: true,
    default: "0 D",
  })
  @Field({ nullable: true })
  public rating?: string;

  @prop({
    required: true,
    default: 0,
  })
  @Field({ nullable: true })
  public contributionPoints?: number;

  @prop({
    ref: "Submission",
    required: true,
    defualt: [],
  })
  @Field(() => [String], { nullable: true })
  public Submissions?: Ref<Submission>[];

  @prop({
    ref: "Problem",
    required: true,
    default: [],
  })
  @Field(() => [String], { nullable: true })
  public createdProblems?: Ref<Problem>[];

  @prop({
    required: true,
  })
  public password: string;

  @prop()
  public accessTokens?: string[];

  @prop()
  public passwordResetToken?: string;

  @prop()
  public emailChangeToken?: string;
}
