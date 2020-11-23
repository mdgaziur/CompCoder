import mongoose, { Schema, Document } from 'mongoose';

declare interface ISubmission extends Document {
    problem: Schema.Types.ObjectId,
    author: Schema.Types.ObjectId,
    sourceFileID: string,
    verdict: "AC" | "CLE" | "WA" | "MLE" | "CE" | "RE",
    testcasesVerdict: Map<string, string>
}

const SubmissionSchema: Schema = new Schema({
    problem: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true
    },
    sourceFileID: {
        type: String,
        required: true
    },
    verdict: {
        type: String,
        enum: ["AC", "CLE", "WA", "MLE", "CE", "RE"],
        required: true
    },
    testcasesVerdict: {
        type: Map,
        required: true
    }
});

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);