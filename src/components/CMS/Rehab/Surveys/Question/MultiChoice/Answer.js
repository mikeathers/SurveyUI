import React from "react";
import { RadioButton } from "components/Common";

import "./Answer.scss";
const Answer = props => {
  return (
    <RadioButton
      label={props.label}
      name={props.groupName}
      value={props.value}
      checked={props.checked}
      onChange={props.onChange}
    />
  );
};

export default Answer;
