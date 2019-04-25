import React, { Component } from "react";
import "./UserMenu.scss";

class UserMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      userMenuClass: "usermenu",
      userMenuDropdownClass: "usermenu__dropdown"
    };
  }
  showDropdown = () => {
    this.setState({ open: !this.state.open }, () => {
      if (this.state.open) {
        this.setState({
          userMenuDropdownClass: "usermenu__dropdown usermenu__dropdown--open",
          userMenuClass: "usermenu usermenu--open"
        });
      } else {
        this.setState({
          userMenuDropdownClass:
            "user-menu__dropdown usermenu__dropdown--close",
          userMenuClass: "usermenu usermenu--close"
        });
      }
    });
  };
  render() {
    const avatar = require("../img/me.png");
    const actions = ["Action 1", "Action 2", "Action 3"];
    return (
      <div id="usermenu" className={this.state.userMenuClass}>
        <div
          className="usermenu__button"
          onClick={this.showDropdown}
          id="usermenu__button"
        >
          <img alt="avatar" src={avatar} className="usermenu__avatar" />
          <p className="usermenu__username">{this.props.username}</p>
          <i className="fa fa-angle-down" />
        </div>
        <div
          id="usermenu__dropdown"
          className={this.state.userMenuDropdownClass}
        >
          {actions.map((action, key) => (
            <div
              id={`usermenu__dropdown--item${++key}`}
              className="usermenu__link"
              key={key}
            >
              <p>{action}</p>
            </div>
          ))}
          <hr />
          <div
            className="usermenu__link"
            id="usermenu__link"
            onClick={() => this.props.logout()}
          >
            <p>Logout</p>
          </div>
        </div>
      </div>
    );
  }
}

export default UserMenu;
