import { User } from './User';
import { prop, Ref } from '@typegoose/typegoose';
import { Problem } from './Problem';
import { ObjectType, Field } from 'type-graphql';

export enum verdict {
    AC = 'AC',
    WA = 'WA',
    CLE = 'CLE',
    MLE = 'MLE',
    CE = 'CE',
    RE = 'RE'
}

@ObjectType()
export class Submission {
    @prop({
        ref: Problem,
        required: true
    })
    @Field(() => Problem)
    public problem: Ref<Problem>;

    @prop({
        ref: User,
        required: true
    })
    @Field(() => User)
    public author: Ref<User>;

    @prop({
        required: true
    })
    public sourceFileID: string;

    @prop({
        enum: verdict,
        required: true
    })
    @Field()
    public verdict: verdict;

    @prop({
        required: true
    })
    public testcasesVerdict: Map<string, verdict>;
};