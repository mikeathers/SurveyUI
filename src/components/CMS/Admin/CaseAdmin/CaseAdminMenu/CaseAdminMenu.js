import React, { Component } from "react";

import "./CaseAdminMenu.scss";
export default class CaseAdminMenu extends Component {
  render() {
    const menuitems = [
      {
        title: "Letter Templates",
        id: "letterTemplatesBtn",
        selectedItem: "letterTemplates",
        icon: "fa fa-file-text"
      },
      {
        title: "Email Templates",
        id: "emailTemplatesBtn",
        selectedItem: "emailTemplates",
        icon: "fa fa-envelope"
      },
      {
        title: "Stop Case Reasons",
        id: "stopCaseReasonsBtn",
        selectedItem: "stopCaseReasons",
        icon: "fa fa-times-circle-o"
      }
    ];
    return (
      <div id="case-admin-menu-container" className="case-admin-menu">
        {menuitems.map((item, key) => {
          const selected =
            this.props.selected === item.selectedItem
              ? "case-admin-menu__item case-admin-menu__item--selected"
              : "case-admin-menu__item";
          return (
            <div
              id={item.id}
              className={selected}
              key={key}
              onClick={() => this.props.selectItem(item.selectedItem)}
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
