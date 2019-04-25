import React from "react";
import { Dropdown } from "semantic-ui-react";
import "./Dropdown.scss";

const sDropdown = props => {
  const style = {
    width: `${props.width}px`
  };
  const className =
    props.valid === "false" ? "sdropdown validate" : "sdropdown";

  return <Dropdown className={className} style={style} {...props} />;
};

export { sDropdown as Dropdown };
