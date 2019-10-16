import React from "react";
import { FlexBox } from "components/Common";
import "./AvailableSurveys.scss";

const Survey = props => {
  const { name, completed, path, completedBy, available } = props.survey;
  const className = available
    ? completed
      ? "survey survey__completed"
      : "survey"
    : "survey survey--unavailable";
  return (
    <div onClick={() => props.selectSurvey(path)} className={className}>
      <FlexBox>
        <i
          className="fa fa-clipboard"
          style={{ color: completed ? "#00AB66" : "grey" }}
        />
        <p>{name}</p>
      </FlexBox>
      {completed && <p id="survey-completed-by">Completed by {completedBy}</p>}
    </div>
  );
};

export default Survey;
