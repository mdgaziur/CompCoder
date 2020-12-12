import { User } from "./../../models/User";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { getModelForClass } from "@typegoose/typegoose";
import { isUniqueField } from "../../utils/isUniqueField";
import { UserInputError } from "apollo-server";
import { hashSync } from "bcrypt";
import { sign } from "jsonwebtoken";

@Resolver()
export class Register {
  @Mutation(() => String)
  async Register(
    @Arg("firstname", () => String) firstName: string,
    @Arg("lastName", () => String) lastName: string,
    @Arg("username", () => String) username: string,
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Arg("confirmPassword", () => String) confirmPassword: string,
    @Ctx() context: any
  ) {
    let userModel = getModelForClass(User);
    let isFirstNameUnique = await isUniqueField(
      firstName,
      "firstName",
      userModel
    );
    let isEmailUnique = await isUniqueField(email, "email", userModel);
    let isusernameUnique = await isUniqueField(username, "username", userModel);

    if (!isFirstNameUnique) {
      throw new UserInputError("First name is not unique!", {
        invalidArgs: ["firstName"],
      });
    }

    if (!isEmailUnique) {
      throw new UserInputError("Email is not unique!", {
        invalidArgs: ["email"],
      });
    }

    if (!isusernameUnique) {
      throw new UserInputError("Username is not unique", {
        invalidArgs: ["username"],
      });
    }

    if (confirmPassword !== password) {
      throw new UserInputError("Both passwords must be same!", {
        invalidArgs: ["password", "passwordConfirm"],
      });
    }

    let saltedPassword = hashSync(password, 10);

    let newUser = await userModel.create({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: saltedPassword,
    });

    let token = sign(
      {
        ip: context.ip,
        userId: newUser._id,
      },
      process.env.JWT_SECRET_KEY || ""
    );

    newUser.accessTokens = [token];
    newUser.save();

    return token;
  }
}
