import React from "react";

import { Checkbox } from "semantic-ui-react";
import "./Checkbox.scss";

const sCheckbox = props => {
  // const className = props.valid === "false" ? "validate" : "";
  return (
    <Checkbox
      label={props.label}
      onChange={props.onChange}
      checked={props.checked}
      className={
        props.valid === "false"
          ? `${props.className} validate`
          : props.className
      }
    />
  );
};

export { sCheckbox as Checkbox };
