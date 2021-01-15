import { User } from "./../../models/User";
import { getModelForClass } from "@typegoose/typegoose";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
  verify,
} from "jsonwebtoken";

export async function loginRequired(req: any, res: any, next: any) {
  let auth_header = req.header("authorization");
  if (!auth_header || auth_header === "") {
    res.status(403);
    res.end();
  } else {
    let token = auth_header.split(" ")[1];
    if (!token) {
      res.status(403);
      res.end();
    } else {
      verify(
        token,
        process.env.JWT_SECRET_KEY || "",
        async (
          err: JsonWebTokenError | NotBeforeError | TokenExpiredError | null,
          payload: any
        ) => {
          if (err) {
            res.status(403);
            res.end();
          } else {
            let user = await getModelForClass(User).findOne({
              _id: payload.userId,
            });
            if (!user) {
              res.status(403);
              res.end();
            } else {
              req.user = user;
              next();
            }
          }
        }
      );
    }
  }
}
