import mongoose, { Schema, Document } from 'mongoose';

declare interface IUser extends Document {
    firstName: string,
    lastName: string,
    username: string,
    company?: string,
    email: string,
    userType: string,
    address?: string,
    profilePicID?: string,
    dateJoined: Date,
    rank: number,
    rating: string,
    contributionPoints: number,
    submissions: Array<Schema.Types.ObjectId>,
    createdProblems: Array<Schema.Types.ObjectId>,
    password: string,
    accessTokens?: Array<string>,
    passwordResetToken?: string
}

const UserSchema: Schema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxLength: 50,
        unique: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minlength: 3,
        maxLength: 15,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    userType: {
        type: String,
        enum: ['admin', 'moderator', 'member'],
        required: true,
        defualt: 'member'
    },
    address: {
        type: String,
        trim: true
    },
    profilePicID: {
        type: String
    },
    dateJoined: {
        type: Date,
        required: true,
        default: new Date()
    },
    rank: {
        type: Number,
        required: true,
        default: -1
    },
    rating: {
        type: String,
        required: true,
        default: "0 D"
    },
    contributionPoints: {
        type: Number,
        required: true,
        defualt: 0
    },
    submissions: [{
        type: Schema.Types.ObjectId,
        ref: 'submissions'
    }],
    createdProblems: [{
        type: Schema.Types.ObjectId,
        ref: 'problems'
    }],
    password: {
        type: String,
        required: true
    },
    accessTokens: [{
        type: String
    }],
    passwordResetToken: {
        type: String
    }
});

export default mongoose.model<IUser>('User', UserSchema);