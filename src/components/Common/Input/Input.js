import React from "react";
import _ from "lodash";
import { Input } from "semantic-ui-react";

import "./Input.scss";

const sInput = props => {
  const style = {
    width: props.fullWidth ? "100%" : `${props.width}%`,
    marginRight: `${props.marginright}px`,
    marginLeft: `${props.marginleft}px`
  };

  const className =
    props.valid === "false" ? ".ui.input validate" : ".ui.input";

  return (
    <Input
      className={className}
      style={style}
      {..._.omit(props, ["fullWidth"])}
    />
  );
};

export { sInput as Input };
