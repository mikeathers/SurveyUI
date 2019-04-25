import React, { Component } from "react";

import "./CaseAdminMenu.scss";
export default class CaseAdminMenu extends Component {
  render() {
    const menuitems = [
      {
        title: "Letter Templates",
        id: "letterTemplates",
        icon: "fa fa-file-text"
      },
      {
        title: "Email Templates",
        id: "emailTemplates",
        icon: "fa fa-envelope"
      },
      {
        title: "Stop Case Reasons",
        id: "caseReasons",
        icon: "fa fa-times-circle-o"
      }
    ];
    return (
      <div className="case-admin-menu">
        {menuitems.map((item, key) => {
          const selected =
            this.props.selected === item.id
              ? "case-admin-menu__item case-admin-menu__item--selected"
              : "case-admin-menu__item";
          return (
            <div
              className={selected}
              key={key}
              onClick={() => this.props.selectItem(item.id)}
            >
              <i className={item.icon} />
              <p>{item.title}</p>
            </div>
          );
        })}
      </div>
    );
  }
}
