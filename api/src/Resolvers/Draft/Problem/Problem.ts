import { getModelForClass } from '@typegoose/typegoose'
import { Problem } from './../../../models/Problem';
import { DocumentType } from '@typegoose/typegoose';
import { UserInputError } from 'apollo-server';
import { isUniqueField } from '../../../utils/isUniqueField';
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { User } from '../../../models/User';

@Resolver()
export class ProblemResolver {
    @Mutation(() => Problem)
    async createProblem(
        @Ctx() context: any,
        @Arg('title', () => String) title: string,
        @Arg('description', () => String) description: String,
        @Arg('availableLangs', () => [String]) availableLangs: string[]
    ) {
        let user:DocumentType<User> = context.user;
        let problemModel = getModelForClass(Problem);
        
        let titleIsUnique = await isUniqueField(title, 'title', problemModel);

        if(!titleIsUnique) {
            throw new UserInputError("Problem title must be unique!", {
                inputArgs: ['title']
            });
        } else {
            let problem = await problemModel.create({
                title: title,
                description: description,
                availableLangs: availableLangs,
                author: user._id
            });
            if(!user.createdProblems) {
                user.createdProblems = [problem._id];
            } else {
                user.createdProblems.push(problem._id);
            }
            user.save();
            return problem;
        }
    }
}