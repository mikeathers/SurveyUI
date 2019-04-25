import React from "react";
import "./PageAction.scss";

const PageAction = props => {
  const style = {};
  return (
    <div style={style} className="pageaction" onClick={props.triggerAction}>
      <p>{props.actionName}</p>
    </div>
  );
};

export { PageAction };
