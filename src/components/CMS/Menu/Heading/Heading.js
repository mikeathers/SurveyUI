import React from "react";

import "./Heading.scss";

const Heading = props => (
  <div className="menu-heading">
    <h3>{props.heading}</h3>
    <hr />
  </div>
);

export default Heading;
