import React from "react";
import { followup3 } from "questions/clinicianSurveyQuestions";
import "./FollowUpThree.scss";

const FollowUpThree = () => (
  <div className="follow-up-three">
    <h3>Follow up 3</h3>
    {followup3.map((followUp, key) => (
      <div className="follow-up-three__followup" key={key}>
        {followUp.answer === "Yes" ? (
          <div>
            <p>
              <span className="follow-up-three__strong">{followUp.answer}</span>
              : {followUp.questionText}
            </p>
            <div>
              {followUp.followUp.map((followUp, key) =>
                followUp.answer === "Yes" ? (
                  <div className="follow-up-three__followup3" key={key}>
                    <p>
                      <span className="follow-up-three__strong">
                        {followUp.answer}
                      </span>
                      : {followUp.questionText}
                    </p>
                    <div>
                      {followUp.followUp.map((followUp, key) => (
                        <div className="follow-up-three__followup3" key={key}>
                          <p>
                            <span className="follow-up-three__strong">
                              {followUp.answer}
                            </span>
                            : {followUp.questionText}
                          </p>
                          {followUp.followUp.map((followUp, key) => (
                            <div
                              className="follow-up-three__followup3"
                              key={key}
                            >
                              <p>
                                <span className="follow-up-three__strong">
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
                  <div className="follow-up-three__followup3" key={key}>
                    <p>
                      <span className="follow-up-three__strong">
                        {followUp.answer}
                      </span>
                      : {followUp.questionText}
                    </p>
                    {followUp.followUp.map((followUp, key) => (
                      <div className="follow-up-three__followup3" key={key}>
                        <p>
                          <span className="follow-up-three__strong">
                            {followUp.answer}
                          </span>
                          : {followUp.questionText}
                        </p>
                        {followUp.followUp.map((followUp, key) => (
                          <div className="follow-up-three__followup3" key={key}>
                            <p>
                              <span className="follow-up-three__strong">
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
              <span className="follow-up-three__strong">{followUp.answer}</span>
              : {followUp.questionText}
            </p>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default FollowUpThree;
