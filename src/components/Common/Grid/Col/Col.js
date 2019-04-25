import React from "react";

import { Col } from "react-bootstrap";

const sCol = props => {
  return <Col {...props}>{props.children}</Col>;
};

export { sCol as Col };
