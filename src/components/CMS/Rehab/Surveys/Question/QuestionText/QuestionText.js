import React from "react";
import "./QuestionText.scss";

const QuestionText = props => {
  return (
    <div className="question-text">
      <p className={props.questionAnswered}>{props.index}</p>
      <p>{props.text}</p>
    </div>
  );
};

export default QuestionText;
