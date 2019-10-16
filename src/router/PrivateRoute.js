import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { AuthConsumer } from "../providers/authProvider";
import { LoadingModal } from "../components/Common/LoadingModal/LoadingModal";


export const PrivateRoute = ({ component, ...rest }) => {
  const renderFn = Component => props => (
    <AuthConsumer>
      {({ isAuthenticatedOidc, signinRedirect }) => {
        if (!!Component && isAuthenticatedOidc()) {
          return <Component {...props} />;
        } else {
          signinRedirect();
          return <LoadingModal
            id="signinRedirectLoadingModal"
            isModalOpen={true}
          />;
        }
      }}
    </AuthConsumer>
  );

  return <Route {...rest} render={renderFn(component)} />;
};




const mapStateToProps = state => ({
  isAuthenticated: state.auth.user.isAuthenticated
});

export default connect(mapStateToProps)(PrivateRoute);
