import React from "react";

import { Row } from "react-bootstrap";

const sRow = props => <Row {...props}>{props.children}</Row>;

export { sRow as Row };
