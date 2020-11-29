import { prop, Ref } from '@typegoose/typegoose';
import { Field, ObjectType } from 'type-graphql';
import { Submission } from './Submission';
import { Problem } from './Problem';
import { MaxLength, MinLength } from 'class-validator';

export enum userTypes {
    admin = 'admin',
    moderator = 'moderator',
    member = 'member'
}

@ObjectType()
export class User {
    @prop({
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true,
        trim: true
    })
    @Field()
    @MaxLength(50)
    @MinLength(3)
    public firstName: string;

    @prop({
        required: true,
        minlength: 3,
        maxlength: 15,
        trim: true
    })
    @Field()
    @MaxLength(10)
    @MinLength(3)
    public lastName: string;

    @prop({
        required: true,
        trim: true
    })
    @Field()
    public username: string

    @prop({
        trim: true
    })
    @Field({ nullable: true })
    public company?: string;

    @prop({
        required: true,
        trim: true,
        validate: email => {
            return new Promise(res => {
                res(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email));
            })
        }
    })
    @Field()
    public email: string;

    @prop({
        enum: userTypes,
        required: true,
        default: 'member'
    })
    @Field()
    public userType?: userTypes;

    @prop({
        trim: true
    })
    @Field({ nullable: true })
    public address?: string;

    @prop()
    @Field()
    public profilePicID?: string;

    @prop({
        required: true,
        default: new Date()
    })
    @Field()
    public dateJoined?: Date;

    @prop({
        required: true,
        default: -1
    })
    @Field()
    public rank?: number;

    @prop({
        required: true,
        default: "0 D"
    })
    @Field()
    public rating?: string;

    @prop({
        required: true,
        default: 0
    })
    @Field()
    public contributionPoints?: number;

    @prop({
        ref: Submission,
        required: true
    })
    @Field(() => [Submission], { nullable: true })
    public Submissions?: Ref<Submission>[];

    @prop({
        ref: Problem,
        required: true
    })
    @Field(() => [Problem], { nullable: true })
    public createdProblems?: Ref<Problem>[];

    @prop({
        required: true
    })
    public password: string;

    @prop()
    public accessTokens?: string[];

    @prop()
    public passwordResetToken?: string;
};