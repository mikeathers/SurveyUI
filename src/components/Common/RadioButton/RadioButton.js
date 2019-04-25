import React from "react";
import { Radio } from "semantic-ui-react";

const RadioButton = props => (
  <div>
    <Radio
      label={props.label}
      name={props.groupName}
      value={props.value}
      checked={props.checked}
      onChange={props.onChange}
    />
  </div>
);

export { RadioButton };
