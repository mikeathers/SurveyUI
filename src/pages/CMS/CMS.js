import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import {
  logoutUser,
  getUserDetails,
  selectPrimaryItem,
  selectSecondaryItem
} from "actions";

import Menu from "components/CMS/Menu/Menu";
import Header from "components/CMS/Header/Header";
import UserBar from "components/CMS/UserBar/UserBar";
import Case from "containers/CMS/Rehab/Case/Case";
import Survey from "containers/CMS/Rehab/Surveys/Surveys";
import ClinicianSurveyComplete from "containers/CMS/Rehab/CompletedSurvey/CompletedSurvey";

import * as menuItems from "routes/secondaryMenuItems";

import "./CMS.scss";

class CMS extends Component {
  componentDidMount() {
    this.props.getUserDetails();
    if (this.props.history.location.pathname === "/cms") this.goToCases();
  }

  goToCases = () => {
    this.props.history.push("/cms/rehab/cases");
    this.props.selectPrimaryItem("Rehab");
    this.props.selectSecondaryItem("Cases");
  };

  renderRoutes = () => {
    let routes = [];
    Object.keys(menuItems).map(menu => {
      menuItems[menu].forEach((item, key) => {
        const route = (
          <Route
            key={key}
            path={item.path}
            component={item.component}
            exact={true}
          />
        );
        routes.push(route);
      });
      return routes;
    });
    return routes;
  };

  render() {
    return (
      <div className="cms">
        <Header title="Case Management" />
        <Menu />
        <div className="cms__container">
          <UserBar logout={this.props.logout} username={this.props.username} />
          <div className="cms__content">
            <Switch>
              <Route path="/cms/rehab/case/:id" component={Case} />
              <Route path="/cms/rehab/survey/initial/:id" component={Survey} />
              <Route
                path="/cms/rehab/survey/clinician/:id"
                component={Survey}
              />
              <Route path="/cms/rehab/survey/soap/:id" component={Survey} />
              <Route
                path="/cms/rehab/survey/discharge/:id"
                component={Survey}
              />
              <Route
                path="/cms/rehab/completedsurvey/clinician"
                component={ClinicianSurveyComplete}
              />
              {this.renderRoutes()}
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  username: state.auth.user.name,
  selectedPrimaryItem: state.menus.selectedPrimaryItem
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logoutUser()),
  getUserDetails: () => dispatch(getUserDetails()),
  selectPrimaryItem: item => dispatch(selectPrimaryItem(item)),
  selectSecondaryItem: item => dispatch(selectSecondaryItem(item))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CMS);
