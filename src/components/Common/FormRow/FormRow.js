import React from "react";
import "./FormRow.scss";

const FormRow = props => {
  const style = {
    display: "flex",
    marginBottom: `${props.marginBottom}px`,
    marginTop: `${props.marginTop}px`
  };
  return (
    <div style={style} className="form-row">
      {props.children}
    </div>
  );
};
export { FormRow };
