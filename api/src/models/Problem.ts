import { User } from './User';
import { Ref, prop, Typegoose } from 'typegoose';
import { Field, ObjectType } from 'type-graphql';
import GraphQLJSON from 'graphql-type-json';

export enum AvailableLangs {
    C = "C",
    CPP = "C++",
    Java = "Java",
    CoffeScript = "CoffeScript",
    Go = "Go",
    Python = "Python",
    CSharp = "CSharp",
    TypeScript = "TypeScript",
    Haskell = "Haskell",
}

@ObjectType()
export class Problem extends Typegoose {
    @prop({
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    })
    @Field()
    public title: string;

    @prop({
        required: true
    })
    @Field(() => GraphQLJSON)
    public description: Object;

    @prop({
        ref: User
    })
    @Field(() => User)
    public author: Ref<User>;

    @prop({
        required: true,
        default: false
    })
    @Field()
    public approved: Boolean;

    @prop({
        enum: AvailableLangs,
        required: true
    })
    @Field()
    public availableLangs: AvailableLangs;
    
    @prop({
        required: true,
        default: new Date()
    })
    @Field()
    public dateCreated: Date;

    @prop({
        required: true
    })
    public testcasesID: Array<string>;

    @prop({
        required: true
    })
    public sampleTestcasesID: Array<string>;
}