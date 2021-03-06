import { problemResolver } from "./Resolvers/Problem/problemResolver";
import { ApolloServer } from "apollo-server-express";
import { config as loadDotEnv } from "dotenv";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import fileUpload from "express-fileupload";
import morgan from "morgan";
// DB connector
import connect from "./db_connect";
// Authentication
import { Login } from "./Resolvers/Auth/LoginResolver";
import { Logout } from "./Resolvers/Auth/LogoutResolver";
import { Register } from "./Resolvers/Auth/RegisterResolver";
import { ResetPassword } from "./Resolvers/Auth/ResetPassword";
import { VerifyPasswordResetToken } from "./Resolvers/Auth/VerifyPasswordResetToken";
// ✔ - Resolvers
import { Test } from "./Resolvers/TestResolver";
import { getUserResolver } from "./Resolvers/User/getUser";
import { ProblemResolver } from "./Resolvers/Draft/Problem/Problem";
import { createSubmission } from "./Resolvers/Submission/createSubmission";
import { userSettings } from "./Resolvers/User/userSettings";
// Utility
import { getUser } from "./utils/User/getUser";
// REST routes
import { testcaseUpload } from "./REST/testcaseUpload/testcaseUpload";
import { getters } from "./Resolvers/Getters/getters";

//Get data from .env file
loadDotEnv();

(async () => {
  const app = express();
  // logging
  app.use(morgan("dev"));

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        Test,
        Login,
        Register,
        Logout,
        ResetPassword,
        VerifyPasswordResetToken,
        getUserResolver,
        userSettings,
        ProblemResolver,
        createSubmission,
        getters,
        problemResolver,
      ],
      authChecker: ({ context: { user } }) => {
        if (!user) {
          return false;
        } else {
          return true;
        }
      },
    }),
    context: async ({ req }) => {
      const auth_header = req.headers.authorization || "";
      let ctxObj: any;
      if (req.socket.remoteAddress) {
        ctxObj = { ip: req.socket.remoteAddress.split(`:`).pop() }; // Fix object is possibly undefined
      } else {
        ctxObj = {};
      }
      if (auth_header) {
        let token = <string>auth_header.split(" ")[1];
        const user = await getUser(token);
        if (!user) {
          return { ...ctxObj };
        } else {
          return { ...ctxObj, user };
        }
      } else {
        return ctxObj;
      }
    },
  });

  server.applyMiddleware({
    app,
    cors: false,
  });

  // REST middlewares
  app.use(fileUpload());

  //REST routes
  app.use("/uploadTestCase", testcaseUpload);

  app.listen(4000, () => {
    console.log("🚀 Server is running on port 4000");
    // Connect to database based on environment
    if (process.env.NODE_ENV !== "production") {
      connect({ db: "mongodb://localhost/compcoder" });
    } else {
      connect({ db: "mongodb://localhost/compcoder" });
    }
  });
})();
