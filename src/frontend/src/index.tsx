import ReactDOM from "react-dom";
import React from "react";
import { App } from "./App";
import { client } from "./graphql/client";
import { ApolloProvider } from "@apollo/client";

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
