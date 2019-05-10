import React, { Component } from "react";
import _ from "lodash";
import * as api from "api";
import { Card } from "components/Common";
import "./SurveyBuilder.scss";

export default class SurveyBuilder extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      completedQuestions:
        props.completedQuestions !== null ? props.completedQuestions : [],
      receivedProps: false
    };
  }

  componentWillMount() {
    this._isMounted = true;
    this.getCompletedQuestions();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps({ completedQuestions }) {
    if (completedQuestions !== undefined && completedQuestions.length > 0) {
      this.setState({
        completedQuestions: _.orderBy(completedQuestions, ["id"])
      });
    }
  }

  getCompletedQuestions = () => {
    const survey = this.props.mi3dCase.completedSurveys.find(
      m => m.type === "Initial"
    );

    if (survey !== undefined) {
      const completedSurveyId = survey.completedSurveyId;

      const completedSurveyRequest = {
        completedSurveyId,
        actionedBy: this.props.username
      };

      api.getCompletedSurvey(completedSurveyRequest).then(res => {
        if (this._isMounted) {
          this.setState({ survey: res.result });
          if (res.result !== undefined) this.parsedQuestions();
        }
      });
    }
  };

  returnAnswer = question => {
    switch (question.type) {
      case "yesno":
        return question.yesNoAnswer;
      case "selection":
        return question.selectionAnswers;
      case "scale":
        return question.scaleAnswer;
      default:
        return null;
    }
  };

  parsedQuestions = () => {
    if (this.state.survey.completedQuestions !== undefined) {
      const parsedQuestions = this.state.survey.completedQuestions.map(
        question => {
          return {
            question: {
              questionId: question.questionId,
              type: question.type,
              text: question.questionText
            },
            answer: this.returnAnswer(question),
            id: question.questionId
          };
        }
      );
      const orderedQuestions = _.orderBy(parsedQuestions, ["id"]);
      this.setState({
        completedQuestions: orderedQuestions
      });
    }
  };

  renderAnswer = completedQuestion => {
    if (completedQuestion.question.type === "selection") {
      return completedQuestion.answer.map((answer, key) => {
        return (
          <span key={key} className="completed-question__answer-selection">
            {++key === completedQuestion.answer.length ? answer : `${answer},`}
          </span>
        );
      });
    } else {
      return (
        <span className="completed-question__answer">
          {completedQuestion.answer}
        </span>
      );
    }
  };
  render() {
    const {
      firstName,
      lastName,
      houseNo,
      address1,
      address2,
      address3,
      address4,
      postCode,
      instructingPartyName
    } = this.props.bdCase;
    const logo = require("./img/logo.png");
    return (
      <Card title="Triage Document">
        <div className="survey-builder">
          <div className="survey-builder__header">
            <div className="survey-builder__contact-info">
              <p>{`${firstName} ${lastName}`}</p>
              <p>{`${houseNo} ${address1}`}</p>
              <p>{address2}</p>
              <p>{address3}</p>
              {address4 !== "" && <p>{address4}</p>}
              <p>{postCode}</p>
              <br />
              <p>On behalf of {instructingPartyName}</p>
              <h3>Initial Triage</h3>
            </div>
            <img src={logo} alt="logo" className="survey-builder__logo" />
          </div>

          {this.state.completedQuestions.length > 0 ? (
            this.state.completedQuestions.map((completedQuestion, key) => (
              <div className="completed-question" key={key}>
                <p className="completed-question__text">
                  {completedQuestion.question.text}
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
