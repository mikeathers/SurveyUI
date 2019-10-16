import React, { Component } from "react";
import "./UserMenu.scss";
import { AuthConsumer } from "../../../../providers/authProvider";

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
          userMenuClass: "usermenu usermenu--open",
          userMenuDropdownClass: "usermenu__dropdown usermenu__dropdown--open"
        });
      } else {
        this.setState({
          userMenuClass: "usermenu usermenu--close",
          userMenuDropdownClass: "user-menu__dropdown usermenu__dropdown--close"
        });
      }
    });
  };

  render() {
    const avatar = require("../img/default.png");
    const actions = ["Action 1", "Action 2", "Action 3"];
    return (
      <div id="usermenu" className={this.state.userMenuClass}>
        <div
          id="usermenu__button"
          // onClick={this.showDropdown}
          className="usermenu__button"
        >
          <img alt="avatar" src={avatar} className="usermenu__avatar" />
          <p className="usermenu__username">{this.props.username}</p>
          {/* <i className="fa fa-angle-down" /> */}
        </div>
        <div
          id="usermenu__dropdown"
          className={this.state.userMenuDropdownClass}
        >
          {actions.map((action, key) => (
            <div
              key={key}
              className="usermenu__link"
              id={`usermenu__dropdown--item${++key}`}
            >
              <p>{action}</p>
            </div>
          ))}
          <hr />
          <AuthConsumer>
            {({ logout }) => {
              return (
                <div
                  id="usermenu__logout"
                  onClick={() => logout()}
                  className="usermenu__link"
                >
                  <p>Logout</p>
                </div>
              );
            }}
          </AuthConsumer>
        </div>
      </div>
    );
  }
}

export default UserMenu;
