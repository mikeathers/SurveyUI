import React, { Component } from "react";

import "./Header.scss";

class Header extends Component {
  showSideMenu = () => {
    document.documentElement.classList.toggle("pull-content-right");
    document.documentElement.classList.toggle("side-menu-open");
  };
  render() {
    return (
      <div className="header">
        <div className="header__title">
          <h2>{this.props.title}</h2>
        </div>
        <input
          type="checkbox"
          className="header__checkbox"
          id="navbar-toggle"
        />
        <label
          htmlFor="navbar-toggle"
          className="header__button"
          onClick={this.showSideMenu}
        >
          <span className="header__icon">&nbsp;</span>
        </label>
      </div>
    );
  }
}

export default Header;
