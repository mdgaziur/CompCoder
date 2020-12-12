import { sign, verify } from "jsonwebtoken";
import { User } from "./../../models/User";
import { DocumentType, getModelForClass } from "@typegoose/typegoose";
import { UserInputError } from "apollo-server";
import { compareSync, hashSync } from "bcrypt";
import { Arg, Authorized, Ctx, Mutation } from "type-graphql";
import { Resolver } from "type-graphql";
import "reflect-metadata";
import { isUniqueField } from "../../utils/isUniqueField";
import { sendEmailChangeMail } from "./email-transporter/email-transporter";

@Resolver()
export class userSettings {
  @Authorized()
  @Mutation(() => Boolean)
  async passwordSettings(
    @Arg("oldPassword", () => String) oldPassword: string,
    @Arg("password", () => String) password: string,
    @Arg("confirmPassword", () => String) confirmPassword: string,
    @Ctx() context: any
  ) {
    let user = context.user;
    let isCorrectPassword = compareSync(oldPassword, user.password);
    if (!isCorrectPassword) {
      throw new UserInputError("Wrong password!", {
        inputArgs: ["oldPassword"],
      });
    } else {
      if (password !== confirmPassword) {
        throw new UserInputError("Both passwords must be equal", {
          inputArgs: ["password", "confirmPassword"],
        });
      } else {
        let saltedPassword = hashSync(password, user.password);
        user.password = saltedPassword;
        user.save();

        return true;
      }
    }
  }
  @Authorized()
  @Mutation(() => Boolean)
  async nameSettings(
    @Ctx() context: any,
    @Arg("firstName", { nullable: true }) firstName?: string,
    @Arg("lastName", { nullable: true }) lastName?: string
  ) {
    let userModel = getModelForClass(User);
    let user: DocumentType<User> = context.user;
    if (firstName) {
      let firstNameIsUnique = await isUniqueField(
        firstName,
        "firstName",
        userModel,
        user
      );
      if (!firstNameIsUnique) {
        throw new UserInputError("First name must be unique!", {
          inputArgs: ["firstName"],
        });
      } else {
        user.firstName = firstName;
        await user.save();
      }
    }
    if (lastName) {
      user.lastName = lastName;
      await user.save();
    }
    return true;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async miscUserSettings(
    @Ctx() context: any,
    @Arg("address", () => String, { nullable: true }) address?: string,
    @Arg("company", () => String, { nullable: true }) company?: string
  ) {
    let user: DocumentType<User> = context.user;
    if (address) {
      user.address = address;
      await user.save();
    }
    if (company) {
      user.company = company;
      await user.save();
    }
    return true; //Success!
  }

  @Authorized()
  @Mutation(() => Boolean)
  async changeEmail(
    @Ctx() context: any,
    @Arg("email", () => String) email: string
  ) {
    let newEmailAddress = email;
    let user: DocumentType<User> = context.user;

    let emailChangeToken = sign(
      {
        changedEmail: newEmailAddress,
        uuid: user._id,
      },
      process.env.JWT_SECRET_KEY || "",
      {
        expiresIn: "300s",
      }
    );

    user.emailChangeToken = emailChangeToken;
    await user.save();

    return (await sendEmailChangeMail(
      emailChangeToken,
      newEmailAddress,
      user.email
    )) === "SUCCESS"
      ? true
      : false;
  }

  @Mutation(() => Boolean)
  async confirmChangeEmail(@Arg("token", () => String) token: string) {
    try {
      let userModel = getModelForClass(User);
      let payload: any = verify(token, process.env.JWT_SECRET_KEY || "");

      let userId = payload.uuid;
      let newEmailAddress = payload.changedEmail;

      let user = await userModel.findOne({
        _id: userId,
      });

      if (!user) {
        return false;
      } else {
        if (user.emailChangeToken !== token) {
          return false;
        }
        user.email = newEmailAddress;
        user.emailChangeToken = "";
        await user.save();

        return true;
      }
    } catch (e) {
      return false;
    }
  }
}
