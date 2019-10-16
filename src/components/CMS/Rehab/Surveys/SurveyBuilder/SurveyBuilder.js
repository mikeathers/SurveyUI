import React, { Component } from "react";
import _ from "lodash";

import { Card } from "components/Common";

import "./SurveyBuilder.scss";

export default class SurveyBuilder extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      completedQuestions:
        props.completedQuestions !== undefined ? props.completedQuestions : []
    };
  }

  componentWillReceiveProps({ completedQuestions }) {
    this.setState({
      completedQuestions: _.orderBy(completedQuestions, ["id"])
    });
  }

  renderAnswer = completedQuestion => {
    const answer = this.props.getCorrectAnswerForQuestionType(
      completedQuestion
    );
    if (completedQuestion.type === "selection") {
      return completedQuestion.selectionAnswers.map((answer, key) => {
        return (
          <span key={key} className="completed-question__answer-selection">
            {++key === completedQuestion.selectionAnswers.length
              ? answer
              : `${answer},`}
          </span>
        );
      });
    } else {
      return <span className="completed-question__answer">{answer}</span>;
    }
  };

  render() {
    const {
      houseNo,
      address1,
      address2,
      address3,
      address4,
      postCode,
      lastName,
      firstName,
      instructingPartyName
    } = this.props.bluedogCase;
    const logo = require("./img/logo.png");
    return (
      <Card title="Triage Document">
        <div className="survey-builder">
          <div className="survey-builder__header">
            <div className="survey-builder__contact-info">
              <p id="surveyBuilderIPName">{`${firstName} ${lastName}`}</p>
              <p id="surveyBuilderAddress1">{`${houseNo} ${address1}`}</p>
              <p id="surveyBuilderAddress2">{address2}</p>
              <p id="surveyBuilderAddress3">{address3}</p>
              {address4 !== "" && <p id="surveyBuilderAddress4">{address4}</p>}
              <p id="surveyBuilderPostcode">{postCode}</p>
              <br />
              <p id="surveyBuilderInstructingPartyName">
                On behalf of {instructingPartyName}
              </p>
              <h3>Initial Triage</h3>
            </div>
            <img
              src={logo}
              alt="logo"
              className="survey-builder__logo"
              id="surveyBuilderLogo"
            />
          </div>
          {this.state.completedQuestions !== [] ? (
            this.state.completedQuestions.map((completedQuestion, key) => (
              <div
                className="completed-question"
                key={key}
                id={`surveyBuilderQuestion${key}`}
              >
                <p className="completed-question__text">
                  {completedQuestion.questionText}
                </p>
                <p className="completed-question__answer-container">
                  {this.renderAnswer(completedQuestion)}
                </p>
              </div>
            ))
          ) : (
            <p className="light">Answer a question to begin...</p>
          )}
        </div>
      </Card>
    );
  }
}
