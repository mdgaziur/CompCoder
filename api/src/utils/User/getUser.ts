import { User } from "./../../models/User";
import { getModelForClass } from "@typegoose/typegoose";
import { verify } from "jsonwebtoken";

/**
 * Returns user with jwt token if valid
 * @param token JWT token for authorization
 * @returns User with jwt token if valid
 */
export async function getUser(token: string): Promise<Object | undefined> {
  const userID = verify(token, process.env.JWT_SECRET_KEY || "");
  if (!userID) {
    return undefined;
  } else {
    try {
      let userModel = getModelForClass(User);
      let token_payload: any = verify(token, process.env.JWT_SECRET_KEY || "");
      let user = await userModel.findOne({
        _id: token_payload.userId,
      });

      if (!user) {
        return undefined;
      } else {
        return user;
      }
    } catch (e) {
      return undefined;
    }
  }
}
