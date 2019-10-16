import React from "react";
import { Form } from "semantic-ui-react";

const sForm = props => (
  <Form className={props.className} onSubmit={props.onSubmit} {...props}>
    {props.children}
  </Form>
);

export { sForm as Form };
