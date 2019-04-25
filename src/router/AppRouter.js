import React from "react";
import { Router } from "react-router-dom";
import { connect } from "react-redux";
import createHistory from "history/createBrowserHistory";

import AppRoutes from "./AppRoutes";

const history = createHistory();

class AppRouter extends React.Component {
  render() {
    return (
      <Router history={history}>
        <AppRoutes />
      </Router>
    );
  }
}
const mapDispatchToProps = dispatch => ({});
const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppRouter);
