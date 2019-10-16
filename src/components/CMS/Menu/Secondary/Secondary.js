import React, { Component } from "react";
import { connect } from "react-redux";
import MenuItem from "./MenuItem/MenuItem";

import { selectSecondaryItem } from "actions";

import * as menuItems from "routes/secondaryMenuItems";

import "./Secondary.scss";

class Secondary extends Component {
  selectMenuItem = item => {
    this.props.selectSecondaryItem(item);
    document.getElementById("navbar-toggle").checked = false;
    document.documentElement.classList.toggle("pull-content-right");
    document.documentElement.classList.toggle("side-menu-open");
  };

  renderItems = () => {
    let selectedMenuItem;

    switch (this.props.selectedPrimaryItem) {
      case "Home":
        selectedMenuItem = "homeMenuItems";
        break;
      case "Admin":
        selectedMenuItem = "adminMenuItems";
        break;
      case "Rehab":
        selectedMenuItem = "rehabMenuItems";
        break;
      default:
        break;
    }

    return menuItems[selectedMenuItem].map((item, key) => {
      return (
        <MenuItem
          key={key}
          title={item.title}
          icon={item.icon}
          selected={this.props.selectedSecondaryItem}
          selectSecondaryItem={this.selectMenuItem}
          path={item.path}
          id={++key}
        />
      );
    });
  };
  render() {
    return <div className="secondary-menu">{this.renderItems()}</div>;
  }
}

const mapStateToProps = state => ({
  selectedPrimaryItem: state.menus.selectedPrimaryItem,
  selectedSecondaryItem: state.menus.selectedSecondaryItem
});

const mapDispatchToProps = dispatch => ({
  selectSecondaryItem: item => dispatch(selectSecondaryItem(item))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Secondary);
