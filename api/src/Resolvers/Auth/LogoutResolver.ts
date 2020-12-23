import { verify } from "jsonwebtoken";
import { User } from "./../../models/User";
import { getModelForClass } from "@typegoose/typegoose";
import { Arg, Mutation, Resolver } from "type-graphql";

@Resolver()
export class Logout {
  @Mutation(() => Boolean)
  async Logout(@Arg("accessToken", () => String) accessToken: string) {
    let userModel = getModelForClass(User);
    try {
      let tokenPayload: any = verify(
        accessToken,
        process.env.JWT_SECRET_KEY || ""
      );
      let userID = tokenPayload.userId;
      let user = await userModel.findOne({
        _id: userID,
      });

      if (!user) {
        return true;
      } else {
        user.accessTokens = user.accessTokens?.filter((token) => {
          if (token === accessToken) {
            return false;
          }
          return true;
        });
        user.save();
        return true;
      }
    } catch (e) {
      return true;
    }
  }
}
