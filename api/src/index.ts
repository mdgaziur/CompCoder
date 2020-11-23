import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';

// ✔ - Resolvers
import { Test } from './Resolvers/TestResolver';

// DB connector
import connect from './db_connect';

(async () => {
    const app = express();

    // Connect to database based on environment
    if(process.env.NODE_ENV === 'development') {
        connect({ db: 'mongodb://localhost/codebuddy' });
    }

    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [Test]
        })
    });

    server.applyMiddleware({
        app,
        cors: false
    });

    app.listen(4000, () => {
        console.log("🚀 Server is running on port 4000");
    })
})()