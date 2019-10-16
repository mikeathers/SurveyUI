import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import Login from "pages/Login/Login";
import NotFound from "pages/NotFound/NotFound";
import CMS from "pages/CMS/CMS";
import  { Callback } from "../components/auth/callback";
import  { Logout } from "../components/auth/logout";
import  { LogoutCallback } from "../components/auth/logoutCallback";
import  { SilentRenew } from "../components/auth/silentRenew";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

export default class AppRoutes extends Component {
  render() {
    return (      
      <Switch>
        <Route exact={true} path="/signin-oidc" component={Callback} />
        <Route exact={true} path="/logout" component={Logout} />
        <Route exact={true} path="/signout-callback-oidc" component={LogoutCallback} />
        <Route exact={true} path="/silentrenew" component={SilentRenew} />

        <PublicRoute path="/" component={Login} exact={true} />
        <PrivateRoute path="/cms" component={CMS} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}
