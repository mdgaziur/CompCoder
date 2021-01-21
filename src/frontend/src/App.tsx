import React from "react";
import "./Styles/index.scss";
import { Register } from "./Components/Register/Register";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export function App() {
  return (
    <Router>
      <Switch>
        <Route path="/register" exact component={Register}></Route>
      </Switch>
    </Router>
  );
}
