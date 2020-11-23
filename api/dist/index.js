"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const TestResolver_1 = require("./Resolvers/TestResolver");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    const server = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [TestResolver_1.Test]
        })
    });
    server.applyMiddleware({
        app,
        cors: false
    });
    app.listen(4000, () => {
        console.log("🚀 Server is running on port 4000");
    });
}))();
//# sourceMappingURL=index.js.map