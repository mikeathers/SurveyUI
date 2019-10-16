import React from "react";

import "./Heading.scss";

const Heading = props => (
  <div className="menu-heading">
    <h4>{props.heading}</h4>
    <hr />
  </div>
);

export default Heading;
