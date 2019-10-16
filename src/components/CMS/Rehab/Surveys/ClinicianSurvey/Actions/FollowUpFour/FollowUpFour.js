import React from "react";
import { followup4 } from "questions/clinicianSurveyQuestions";
import "./FollowUpFour.scss";

const FollowUpFour = () => (
  <div className="follow-up-four">
    <h3>Follow up 4</h3>
    {followup4.map((followUp, key) => (
      <div className="follow-up-four__followup" key={key}>
        {followUp.answer === "Yes" ? (
          <div>
            <p>
              <span className="follow-up-four__strong">{followUp.answer}</span>:{" "}
              {followUp.questionText}
            </p>
          </div>
        ) : (
          <div>
            <p>
              <span className="follow-up-four__strong">{followUp.answer}</span>:{" "}
              {followUp.questionText}
            </p>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default FollowUpFour;
