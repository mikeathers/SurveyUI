import React from "react";
import "./PageHeader.scss";

const PageHeader = props => {
  return (
    <div className="pageheader">
      <div className="pageheader__title">
        <h2>{props.title}</h2>
        <h3>{props.subtitle}</h3>
      </div>

      <div className="pageheader__actions">{props.children}</div>
    </div>
  );
};

export { PageHeader };
