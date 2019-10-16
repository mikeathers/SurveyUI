import React, { Component } from "react";
import { connect } from "react-redux";
import { selectPrimaryItem, selectSecondaryItem } from "actions";
import MenuItem from "./MenuItem/MenuItem";
import primaryMenuItems from "routes/primaryMenuItems";

import "./Primary.scss";

class Primary extends Component {
  selectMenuItem = item => {
    this.props.selectPrimaryItem(item);

    switch (item) {
      case "Rehab":
        this.props.selectSecondaryItem("New Cases");
        break;
      case "Admin":
        this.props.selectSecondaryItem("Case");
        break;
      default:
        return null;
    }
  };
  render() {
    return (
      <div className="primary-menu">
        {primaryMenuItems.map((item, key) => (
          <MenuItem
            key={key}
            title={item.title}
            icon={item.icon}
            selected={this.props.selectedPrimaryItem}
            selectMenuItem={this.selectMenuItem}
            path={item.path}
            id={++key}
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedPrimaryItem: state.menus.selectedPrimaryItem
});

const mapDispatchToProps = dispatch => ({
  selectPrimaryItem: item => dispatch(selectPrimaryItem(item)),
  selectSecondaryItem: item => dispatch(selectSecondaryItem(item))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Primary);
