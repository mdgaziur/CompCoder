import { UserInputError } from 'apollo-server';
import { compareSync, hashSync } from 'bcrypt';
import { Arg, Authorized, Ctx, Mutation } from 'type-graphql';
import { Resolver } from 'type-graphql';
import 'reflect-metadata';

@Resolver()
export class userSettings {
    @Authorized()
    @Mutation(() => Boolean)
    async passwordSettings(
        @Arg('oldPassword', () => String) oldPassword: string,
        @Arg('password', () => String) password: string,
        @Arg('confirmPassword', () => String) confirmPassword: string,
        @Ctx() context: any
    ) {
        let user = context.user;
        let isCorrectPassword = compareSync(oldPassword, user.password);
        if(!isCorrectPassword) {
            throw new UserInputError("Wrong password!", {
                inputArgs: ['oldPassword']
            });
        } else {
            if(password !== confirmPassword) {
                throw new UserInputError("Both passwords must be equal", {
                    inputArgs: ['password', 'confirmPassword']
                });
            } else {
                let saltedPassword = hashSync(password, user.password);
                user.password = saltedPassword;
                user.save();

                return true;
            }
        }
    }
}