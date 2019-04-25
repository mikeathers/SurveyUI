import React from "react";

import { Checkbox } from "semantic-ui-react";

const sCheckbox = props => (
  <Checkbox
    label={props.label}
    onChange={props.onChange}
    checked={props.checked}
  />
);

export { sCheckbox as Checkbox };
