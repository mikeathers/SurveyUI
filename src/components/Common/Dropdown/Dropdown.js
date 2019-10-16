import React from "react";
import _ from "lodash";
import { Dropdown } from "semantic-ui-react";
import "./Dropdown.scss";

const sDropdown = props => {
  const style = {
    width: props.fullWidth ? "100%" : `${props.width}px`
  };
  const className =
    props.valid === "false" ? "sdropdown validate" : "sdropdown";

  return (
    <Dropdown
      className={className}
      style={style}
      {..._.omit(props, ["fullWidth"])}
    />
  );
};

export { sDropdown as Dropdown };
