import mongoose, { Schema, Document } from 'mongoose';

type AvailableLangs = "C" | "C++" | "Java" | "CoffeScript" | "Go" | "Python" | "CSharp" | "TypeScript" | "Haskell";

declare interface IProblem extends Document {
    Title: string,
    Description: Object,
    Submissions: Array<Schema.Types.ObjectId>,
    Author: Schema.Types.ObjectId,
    Approved: Boolean,
    AvailableLangs: AvailableLangs[],
    dateCreated: Date,
    TestCasesID: Array<string>,
    SampleTestCasesID: Array<string>
}

const ProblemSchema: Schema = new Schema({
    Title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    Description: {
        type: Object,
        required: true
    },
    Submissions: [{
        type: Schema.Types.ObjectId,
        ref: 'submissions'
    }],
    Author: {
        type: Schema.Types.ObjectId,
        ref: 'author'
    },
    Approved: {
        type: Boolean,
        required: true,
        default: false
    },
    AvailableLangs: [{
        type: String,
        enum: ['C', 'C++', 'Java', 'Javascript', 'CoffeeScript', 'Go', 'Python', 'CSharp', 'TypeScript', 'Haskell'],
        required: true
    }],
    dateCreated: {
        type: Date,
        required: true,
        default: new Date()
    },
    TestCasesID: [{
        type: String,
        required: true,
    }],
    SampleTestCasesID: [{
        type: String,
        required: true
    }]
});

export default mongoose.model<IProblem>('Problem', ProblemSchema);