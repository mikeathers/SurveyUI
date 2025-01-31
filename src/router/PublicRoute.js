import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

export const PublicRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      component={props =>
        isAuthenticated ? <Redirect to="/cms" /> : <Component {...props} />
      }
    />
  );
};

const mapStateToProps = state => {
  return { isAuthenticated: state.auth.isAuthenticated };
};

export default connect(mapStateToProps)(PublicRoute);
