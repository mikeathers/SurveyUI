import React from "react";
import { Input } from "semantic-ui-react";

import "./Input.scss";

const sInput = props => {
  const style = {
    width: `${props.width}%`
  };

  const className =
    props.valid === "false" ? ".ui.input validate" : ".ui.input";

  return <Input className={className} style={style} {...props} />;
};

export { sInput as Input };
