import React from "react";

import { Container } from "react-bootstrap";

const sContainer = props => <Container {...props}>{props.children}</Container>;

export { sContainer as Container };
