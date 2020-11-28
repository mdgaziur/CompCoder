import { getModelForClass } from '@typegoose/typegoose';
import { User } from '../models/User';
import { verify } from 'jsonwebtoken';

/**
 * Returns user with jwt token if valid
 * @param token JWT token for authorization
 * @returns User with jwt token if valid
 */
export async function getUser(token: string): Promise<Object | null> {
    const userID = verify(token, process.env.JWT_SECRET_KEY || '');
    if(!userID) {
        return null;
    }
    else {
        let UserModel = getModelForClass(User);
        const user = await UserModel.findOne({
            _id: userID
        });
        return user;
    }
}