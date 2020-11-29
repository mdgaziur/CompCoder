import { UserInputError } from 'apollo-server';
import { getModelForClass } from '@typegoose/typegoose';
import { User } from './../../models/User';
import { Arg, Resolver, Query, Authorized, Ctx } from 'type-graphql';

@Resolver()
export class getUserResolver {
    @Query(() => User)
    async getUserById(
        @Arg('userID', () => String) userID: string
    ) {
        let userModel = getModelForClass(User);
        let user = await userModel.findOne({
            _id: userID
        });
        if(!user) {
            throw new UserInputError("No such user!", {
                inputArgs: ['userID']
            });
        } else {
            return user;
        }
    }

    @Authorized()
    @Query(() => User)
    async getUserWithoutId(
        @Ctx() context: any
    ) {
        return context.user;
    }
}