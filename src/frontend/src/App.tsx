import React, { useEffect, useState } from "react";
import { client } from "./graphql/client";
import "./Styles/index.scss";
import { userDBQuery } from "./graphql/queries/userDB";

export function App() {
  let [userDB, setUserDB] = useState({});
  useEffect(() => {
    (async () => {
      let data = await client.query({
        query: userDBQuery,
      });
      setUserDB(data);
    })();
  }, []);
  return (
    <div id="app">
      <h1>Hello from CompCoder!</h1>
      <p>{JSON.stringify(userDB)}</p>
    </div>
  );
}
