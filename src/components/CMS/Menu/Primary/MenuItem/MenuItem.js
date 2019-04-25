import React from "react";
import { NavLink } from "react-router-dom";

import "./MenuItem.scss";

const MenuItem = props => {
  const selected =
    props.selected === props.title
      ? "primary-menu-item primary-menu-item--selected"
      : "primary-menu-item";
  return (
    <div
      id={`primary-menu__item${props.id}`}
      className={selected}
      onClick={() => props.selectMenuItem(props.title)}
    >
      <NavLink to={props.path}>
        <i className={props.icon} />
        <p> {props.title}</p>
      </NavLink>
    </div>
  );
};

export default MenuItem;
