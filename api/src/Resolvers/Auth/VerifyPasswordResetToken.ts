import { verify } from 'jsonwebtoken';
import { User } from './../../models/User';
import { getModelForClass } from '@typegoose/typegoose';
import { Arg, Mutation, Resolver } from "type-graphql";

@Resolver()
export class VerifyPasswordResetToken {
    @Mutation(() => Boolean)
    async VerifyPasswordResetToken(
        @Arg('resetToken', () => String) resetToken: string
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