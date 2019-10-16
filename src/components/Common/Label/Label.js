import React from "react";

import "./Label.scss";

const Label = props => {
  const style = {
    width: `${props.width}px`,
    marginTop: `${props.marginTop}px`,
    cursor: props.button && "pointer",
    fontWeight: props.thin ? "200" : "500"
  };
  const classStyle = props.light ? "label label__light" : "label";
  return (
    <p style={style} className={classStyle}>
      {props.text}
    </p>
  );
};

export { Label };
