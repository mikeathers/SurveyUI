import React from "react";
import "./ButtonContainer.scss";

const ButtonContainer = props => {
  const style = {
    display: "flex",
    marginBottom: `${props.marginBottom}px`,
    marginTop: `${props.marginTop}px`,
    justifyContent: props.justifyContent,
    alignItems: props.alignItems
  };
  return (
    <div style={style} className="button-container">
      {props.children}
    </div>
  );
};

export { ButtonContainer };
