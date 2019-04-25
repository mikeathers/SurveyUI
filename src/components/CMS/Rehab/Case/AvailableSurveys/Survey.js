import React from "react";
import "./AvailableSurveys.scss";
const Survey = props => {
  const { name, completed, path, completedBy } = props.survey;
  const className = completed ? "survey survey__completed" : "survey";
  return (
    <div
      onClick={() => props.selectSurvey(path)}
      className={className}
      id={`available-survey-${props.id}`}
    >
      <p>{name}</p>
      {completed && <p id="survey-completed-by">Completed by {completedBy}</p>}
    </div>
  );
};

export default Survey;
