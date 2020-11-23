import { prop, Ref, Typegoose } from 'typegoose';
import { Field, ObjectType } from 'type-graphql';
import { Submission } from './Submission';
import { Problem } from './Problem';

export enum userTypes {
    admin = 'admin',
    moderator = 'moderator',
    member = 'member'
}

@ObjectType()
export class User extends Typegoose {
    @prop({
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true,
        trim: true
    })
    @Field()
    public firstName: string;

    @prop({
        required: true,
        minlength: 3,
        maxlength: 15,
        trim: true
    })
    @Field()
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
    @Field()
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
    public userType: userTypes;

    @prop({
        trim: true
    })
    @Field()
    public address: string;

    @prop()
    @Field()
    public profilePicID: string;

    @prop({
        required: true,
        default: new Date()
    })
    @Field()
    public dateJoined: Date;

    @prop({
        required: true,
        default: -1
    })
    @Field()
    public rank: number;

    @prop({
        required: true,
        default: "0 D"
    })
    @Field()
    public rating: string;

    @prop({
        required: true,
        default: 0
    })
    @Field()
    public contributionPoints: number;

    @prop({
        ref: Submission 
    })
    @Field(() => [Submission])
    public Submissions: Ref<Submission>[];

    @prop({
        ref: Problem
    })
    @Field(() => [Problem])
    public createdProblems: Ref<Problem>[];

    @prop({
        required: true
    })
    public password: string;

    @prop()
    public accessTokens: string[];

    @prop()
    passwordResetToken: string;
};