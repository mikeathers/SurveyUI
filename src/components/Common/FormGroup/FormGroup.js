import React from "react";

import "./FormGroup.scss";

const FormGroup = props => {
  const inline = props.inline
    ? "sform-group sform-group-inline"
    : "sform-group";
  const style = {
    flexBasis: `${props.flexBasis}%`,
    marginBottom: `${props.marginBottom}px`,
    marginRight: `${props.marginRight}px`,
    marginLeft: `${props.marginLeft}px`
  };
  return (
    <div style={style} className={inline}>
      {props.children}
    </div>
  );
};

export { FormGroup };
