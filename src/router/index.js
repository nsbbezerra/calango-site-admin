import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "../pages/home";
import Raffles from "../pages/raffles";
import Clients from "../pages/clients";
import Configs from "../pages/configs";

export default function Routering() {
  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/raffles" exact>
        <Raffles />
      </Route>
      <Route path="/clients" exact>
        <Clients />
      </Route>
      <Route path="/configs" exact>
        <Configs />
      </Route>
    </Switch>
  );
}
