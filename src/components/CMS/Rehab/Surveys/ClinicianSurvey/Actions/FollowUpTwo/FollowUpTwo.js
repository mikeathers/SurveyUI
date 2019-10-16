import React from "react";
import { followup2 } from "questions/clinicianSurveyQuestions";
import "./FollowUpTwo.scss";

const FollowUpTwo = () => (
  <div className="follow-up-two">
    <h3>Follow up 2</h3>
    {followup2.map((followUp, key) => (
      <div className="follow-up-two__followup" key={key}>
        {followUp.answer === "Yes" ? (
          <div>
            <p>
              <span className="follow-up-two__strong">{followUp.answer}</span>:{" "}
              {followUp.questionText}
            </p>
            <div>
              {followUp.followUp.map((followUp, key) => (
                <div className="follow-up-two__followup2" key={key}>
                  <p>
                    <span className="follow-up-two__strong">
                      {followUp.answer}
                    </span>
                    : {followUp.questionText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p>
              <span className="follow-up-two__strong">{followUp.answer}</span>:{" "}
              {followUp.questionText}
            </p>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default FollowUpTwo;
