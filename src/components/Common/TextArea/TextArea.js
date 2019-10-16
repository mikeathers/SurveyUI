import React from "react";
import { TextArea as Text } from "semantic-ui-react";

const TextArea = props => {
  const style = {
    borderRadius: "3px",
    marginRight: `${props.marginright}px`,
    width: `${props.width}%`
  };
  const className = props.valid === "false" ? "validate" : props.className;
  return <Text className={className} style={style} {...props} />;
};

export { TextArea };
