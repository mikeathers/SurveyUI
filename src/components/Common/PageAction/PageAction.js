import React from "react";
import "./PageAction.scss";

const PageAction = props => {
  const className = props.disabled ? "pageaction-disabled" : "pageaction";
  return (
    <div className={className} onClick={props.triggerAction}>
      <p>{props.actionName}</p>
    </div>
  );
};

export { PageAction };
