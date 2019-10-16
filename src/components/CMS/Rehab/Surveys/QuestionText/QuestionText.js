import React from "react";
import "./QuestionText.scss";

const QuestionText = ({ questionText, answered, index }) => {
  const answeredClass = answered
    ? "question-text__number question-text__number--answered"
    : "question-text__number";
  return (
    <div className="question-text">
      <p id="surveyQuestionTextIndex" className={answeredClass}>
        {index}
      </p>
      <p id="surveyQuestionTextText">{questionText}</p>
    </div>
  );
};

export default QuestionText;
