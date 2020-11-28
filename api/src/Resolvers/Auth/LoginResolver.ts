import { UserInputError } from 'apollo-server';
import { User } from './../../models/User';
import { getModelForClass } from '@typegoose/typegoose';
import { Arg, Ctx, Mutation,  Resolver } from "type-graphql";
import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';

@Resolver()
export class Login {
    @Mutation(() => String)
    async Login(
        @Arg("email", () => String) email: string,
        @Arg("password", () => String) password: string,
        @Ctx() context: any
    ) {
        let userModel = getModelForClass(User);

        let user = await userModel.findOne({
            email: email
        });

        if (!user) {
            throw new UserInputError("No such user!", {
                invalidArgs: ["email"]
            });
        }

        let isCorrectPassword = compareSync(password, user.password);
        if (!isCorrectPassword) {
            throw new UserInputError("Wrong password!", {
                invalidArgs: ["password"]
            });
        } else {
            let token = sign({
                ip: context.ip,
                userId: user._id
            }, process.env.JWT_SECRET_KEY || '');

            user.accessTokens = [token];
            user.save();

            return token;
        }
    }
}