import React from "react";
import { followup1 } from "questions/clinicianSurveyQuestions";
import "./FollowUpOne.scss";

const FollowUpOne = () => (
  <div className="follow-up-one">
    <h3>Follow up 1</h3>
    {followup1.map((followUp, key) => (
      <div className="follow-up-one__followup" key={key}>
        {followUp.answer === "Yes" ? (
          <div>
            <p>
              <span className="follow-up-one__strong">{followUp.answer}</span>:{" "}
              {followUp.questionText}
            </p>
            <div>
              {followUp.followUp.map((followUp, key) => (
                <div className="follow-up-one__followup2" key={key}>
                  <p>
                    <span className="follow-up-one__strong">
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
              <span className="follow-up-one__strong">{followUp.answer}</span>:{" "}
              {followUp.questionText}
            </p>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default FollowUpOne;
