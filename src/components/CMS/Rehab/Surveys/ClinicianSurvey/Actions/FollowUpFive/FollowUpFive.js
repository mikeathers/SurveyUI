import React from "react";
import { followup5 } from "questions/clinicianSurveyQuestions";
import "./FollowUpFive.scss";

const FollowUpFive = () => (
  <div className="follow-up-five">
    <h3>Follow up 5</h3>
    {followup5.map((followUp, key) => (
      <div className="follow-up-five__followup" key={key}>
        {followUp.answer === "Yes" ? (
          <div>
            <p>
              <span className="follow-up-five__strong">{followUp.answer}</span>:{" "}
              {followUp.questionText}
            </p>
            <div>
              {followUp.followUp.map((followUp, key) =>
                followUp.answer === "Yes" ? (
                  <div className="follow-up-five__followup5" key={key}>
                    <p>
                      <span className="follow-up-five__strong">
                        {followUp.answer}
                      </span>
                      : {followUp.questionText}
                    </p>
                    <div>
                      {followUp.followUp.map((followUp, key) => (
                        <div className="follow-up-five__followup5" key={key}>
                          <p>
                            <span className="follow-up-five__strong">
                              {followUp.answer}
                            </span>
                            : {followUp.questionText}
                          </p>
                          {followUp.followUp.map((followUp, key) => (
                            <div
                              className="follow-up-five__followup5"
                              key={key}
                            >
                              <p>
                                <span className="follow-up-five__strong">
                                  {followUp.answer}
                                </span>
                                : {followUp.questionText}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="follow-up-five__followup5" key={key}>
                    <p>
                      <span className="follow-up-five__strong">
                        {followUp.answer}
                      </span>
                      : {followUp.questionText}
                    </p>
                    {followUp.followUp.map((followUp, key) => (
                      <div className="follow-up-five__followup5" key={key}>
                        <p>
                          <span className="follow-up-five__strong">
                            {followUp.answer}
                          </span>
                          : {followUp.questionText}
                        </p>
                        {followUp.followUp.map((followUp, key) => (
                          <div className="follow-up-five__followup5" key={key}>
                            <p>
                              <span className="follow-up-five__strong">
                                {followUp.answer}
                              </span>
                              : {followUp.questionText}
                            </p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <div>
            <p>
              <span className="follow-up-five__strong">{followUp.answer}</span>:{" "}
              {followUp.questionText}
            </p>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default FollowUpFive;
