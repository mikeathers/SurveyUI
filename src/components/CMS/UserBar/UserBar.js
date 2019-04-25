import React, { Component } from "react";
import UserMenu from "./UserMenu/UserMenu";

import "./UserBar.scss";
export default class UserBar extends Component {
  render() {
    const logo = require("./img/3d-logo.png");
    return (
      <div className="userbar">
        <div className="userbar__search">
          <img src={logo} alt="logo" className="userbar__logo" />
        </div>
        <div>
          <UserMenu username={this.props.username} logout={this.props.logout} />
        </div>
      </div>
    );
  }
}
