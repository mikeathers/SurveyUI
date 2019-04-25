import React from "react";
import { NavLink } from "react-router-dom";

import "./MenuItem.scss";

const MenuItem = props => {
  const selected =
    props.selected === props.title
      ? "secondary-menu-item secondary-menu-item--selected"
      : "secondary-menu-item";
  return (
    <div
      id={`secondary-menu__item${props.id}`}
      className={selected}
      onClick={() => props.selectSecondaryItem(props.title)}
    >
      <NavLink to={props.path}>
        <i className={props.icon} />
        {props.title}
      </NavLink>
    </div>
  );
};

export default MenuItem;
