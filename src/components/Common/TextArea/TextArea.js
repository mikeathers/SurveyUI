import React from "react";
import { TextArea as Text } from "semantic-ui-react";

const TextArea = props => {
  const style = {
    border: props.valid === "false" ? "1px solid red" : "",
    borderRadius: "3px"
  };
  return <Text style={style} {...props} />;
};

export { TextArea };
