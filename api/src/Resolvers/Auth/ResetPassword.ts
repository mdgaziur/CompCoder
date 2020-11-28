import { sign, verify } from 'jsonwebtoken';
import { UserInputError } from 'apollo-server';
import { User } from './../../models/User';
import { getModelForClass } from "@typegoose/typegoose";
import { Arg, Mutation, Resolver } from "type-graphql";
import { sendResetMail } from './email-transporter/email-transporter';
import { hashSync } from 'bcrypt';

@Resolver()
export class ResetPassword {
    @Mutation(() => String)
    async sendResetEmail(
        @Arg('email', () => String) email: string
    ) {
        let userModel = getModelForClass(User);
        let user = await userModel.findOne({
            email: email
        });

        if (!user) {
            throw new UserInputError("There is no user with that email", {
                inputArgs: ["email"]
            });
        } else {
            let resetToken = sign({
                userId: user._id,
            }, process.env.JWT_SECRET_KEY || '', {
                expiresIn: "300s"
            });
            user.passwordResetToken = resetToken;
            user.save();

            let mailStatus = await sendResetMail(resetToken, user.email);

            return mailStatus;
        }
    }
    @Mutation(() => Boolean)
    async ResetPassword(
        @Arg('resetToken', () => String) resetToken: string,
        @Arg('password', () => String) password: string
    ) {
        let userModel = getModelForClass(User);
        let user = await userModel.findOne({
            passwordResetToken: resetToken
        });
        if(!user) {
            return false;
        } else {
            try {
                let token_payload: any = verify(resetToken, process.env.JWT_SECRET_KEY || '',);
                let user = await userModel.findOne({
                    _id: token_payload.userId
                });
                if(user) {
                    let saltedPassword = hashSync(password, 10);
                    user.password = saltedPassword;
                    user.save();

                    return true;
                } else {
                    return false;
                }
            } catch(e) {
                user.passwordResetToken = '';
                return false;
            }
        }
    }
}