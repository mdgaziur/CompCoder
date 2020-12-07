import { Submission } from './Submission';
import { User } from './User';
import { Ref, prop } from '@typegoose/typegoose';
import { Field, ObjectType } from 'type-graphql';


@ObjectType()
export class Problem {
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
    @Field(() => String)
    public description: String;

    @prop({
        ref: 'User',
        required: true
    })
    @Field(() => String)
    public author: Ref<User>;

    @prop({
        required: true,
        default: false
    })
    @Field()
    public approved?: Boolean;

    @prop({
        required: true
    })
    @Field(() => [String])
    public availableLangs: string[]
    
    @prop({
        required: true,
        default: new Date()
    })
    @Field()
    public dateCreated?: Date;

    @prop({
        required: true,
        default: Object
    })
    public sampleTestcasesMeta?: object;

    @prop({
        required: true,
        default: Object
    })
    public testcasesMeta?: object;

    @prop({
        ref: 'Submission'
    })
    public Submissions?: Ref<Submission>;
}