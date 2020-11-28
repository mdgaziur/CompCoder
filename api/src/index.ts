import { ApolloServer } from 'apollo-server-express';
import { config as loadDotEnv } from 'dotenv';
import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
// DB connector
import connect from './db_connect';
// Authentication
import { Login } from './Resolvers/Auth/LoginResolver';
import { Logout } from './Resolvers/Auth/LogoutResolver';
import { Register } from './Resolvers/Auth/RegisterResolver';
import { ResetPassword } from './Resolvers/Auth/ResetPassword';
import { VerifyPasswordResetToken } from './Resolvers/Auth/VerifyPasswordResetToken';
// ✔ - Resolvers
import { Test } from './Resolvers/TestResolver';
import { getUserResolver } from './Resolvers/User/getUser';
// Utility
import { getUser } from './utils/User/getUser';





//Get data from .env file
loadDotEnv();




(async () => {
    const app = express();

    // Connect to database based on environment
    if (process.env.NODE_ENV !== 'production') {
        connect({ db: 'mongodb://localhost/codebuddy' });
    }

    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                Test,
                Login,
                Register,
                Logout,
                ResetPassword,
                VerifyPasswordResetToken,
                getUserResolver
            ]
        }),
        context: async ({ req }) => {
            const auth_header = req.headers.authorization || '';
            const ctxObj = { ip: req?.connection?.remoteAddress?.split(`:`)?.pop() }; // Fix object is possibly undefined
            if (auth_header) {
                let token = <string>auth_header.split(' ')[1];
                const user = await getUser(token);
                return { ...ctxObj, user };
            } else {
                return ctxObj;
            }
        }
    });

    server.applyMiddleware({
        app,
        cors: false
    });

    app.listen(4000, () => {
        console.log("🚀 Server is running on port 4000");
    })
})()