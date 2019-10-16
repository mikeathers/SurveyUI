import React from "react";
import "./PageHeader.scss";

const PageHeader = props => {
  return (
    <div className="pageheader">
      <div className="pageheader__title">
        <h2>{props.title}</h2>
      </div>

      <div className="pageheader__actions">{props.children}</div>
    </div>
  );
};

export { PageHeader };
