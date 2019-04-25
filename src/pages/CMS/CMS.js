import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectPrimaryItem,
  selectSecondaryItem,
  hideErrorModal,
  logoutUser
} from "actions";

import { ErrorModal } from "components/Common";

import Menu from "components/CMS/Menu/Menu";
import Header from "components/CMS/Header/Header";
import UserBar from "components/CMS/UserBar/UserBar";
import Case from "containers/CMS/Rehab/Case/Case";
import Survey from "containers/CMS/Rehab/Surveys/Surveys";

import * as menuItems from "routes/secondaryMenuItems";

import "./CMS.scss";

class CMS extends Component {
  state = {
    showErrorModal: this.props.showErrorModal
  };
  componentDidMount() {
    if (this.props.history.location.pathname === "/cms") {
      // this.props.history.push("/cms/rehab/survey/initial/20007506/1");

      // this.props.history.push("/cms/rehab/case/20007485/1");

      this.props.history.push("/cms/rehab/dashboard");
      this.props.selectPrimaryItem("Rehab");
      this.props.selectSecondaryItem("Dashboard");

      // this.props.history.push("/cms/admin/case");
      // this.props.selectPrimaryItem("Admin");
      // this.props.selectSecondaryItem("Case");
    }
  }

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
                path="/cms/rehab/survey/customersatisfaction/:id"
                component={Survey}
              />
              {this.renderRoutes()}
            </Switch>
          </div>
        </div>
        <ErrorModal
          isModalOpen={this.props.showErrorModal}
          closeModal={() => this.props.hideErrorModal()}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedPrimaryItem: state.menus.selectedPrimaryItem,
  showErrorModal: state.shared.showErrorModal,
  username: state.auth.user.name
});

const mapDispatchToProps = dispatch => ({
  selectPrimaryItem: item => dispatch(selectPrimaryItem(item)),
  selectSecondaryItem: item => dispatch(selectSecondaryItem(item)),
  hideErrorModal: () => dispatch(hideErrorModal()),
  logout: () => dispatch(logoutUser())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CMS);
