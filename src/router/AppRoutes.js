import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import Login from "pages/Login/Login";
import NotFound from "pages/NotFound/NotFound";
import CMS from "pages/CMS/CMS";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

export default class AppRoutes extends Component {
  render() {
    return (
      <Switch>
        <PublicRoute path="/" component={Login} exact={true} />
        <PrivateRoute path="/cms" component={CMS} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}
