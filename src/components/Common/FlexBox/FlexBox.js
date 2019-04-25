import React from "react";
import "./FlexBox.scss";

const FlexBox = props => {
  const style = {
    display: "flex",
    justifyContent: props.justifyContent,
    alignItems: props.alignItems,
    marginTop: `${props.marginTop}px`,
    marginBottom: `${props.marginBottom}px`
  };
  return <div style={style}>{props.children}</div>;
};
export { FlexBox };
