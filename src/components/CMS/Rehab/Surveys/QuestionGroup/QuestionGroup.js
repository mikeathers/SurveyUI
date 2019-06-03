import React, { Component } from "react";
import _ from "lodash";
import { Question } from "../Question/Question";
import CaseModal from "components/CMS/Rehab/Case/CaseModal/CaseModal";
import "./QuestionGroup.scss";

export default class QuestionGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completedQuestions: [],
      caseModalOpen: false,
      updatedQuestions: [],
      receivedProps: false,
      knockoutQuestion: {}
    };
  }

  componentWillReceiveProps({ completedQuestions }) {
    if (!this.state.receivedProps) {
      if (completedQuestions !== undefined) {
        const orderedQuestions = _.orderBy(completedQuestions, ["id"]);
        this.setState({
          completedQuestions: orderedQuestions,
          receivedProps: true
        });
      }
    }
  }

  returnCompletedQuestion = result => {
    let updatedQuestions = this.state.completedQuestions
      .filter(m => m.id !== result.id)
      .concat(result);
    this.setState(
      { completedQuestions: _.orderBy(updatedQuestions, ["id"]) },
      () => this.props.returnQuestions(this.state.completedQuestions)
    );
  };

  filterQuestionList = async id => {
    return await this.state.completedQuestions.filter(m => m.id !== id);
  };

  removeQuestionFromList = async id => {
    const updatedQuestions = await this.filterQuestionList(id);
    this.setState({ completedQuestions: updatedQuestions }, () => {
      this.props.returnQuestions(this.state.completedQuestions);
    });
  };

  stopSurvey = knockoutQuestion => {
    this.setState({ caseModalOpen: true, knockoutQuestion });
  };

  submitSurvey = () => {
    this.props.submitSurvey(this.state.completedQuestions);
  };

  returnAnswer = key => {
    if (this.state.completedQuestions !== undefined) {
      const question = this.state.completedQuestions[--key];
      if (question !== undefined) return question.answer;
    }
  };

  render() {
    const text = "KNOCK OUT ANSWER GIVEN";
    return (
      <div className="question-group">
        {this.props.questions.map((question, key) => {
          return (
            <Question
              key={key}
              question={question}
              type={question.type}
              index={++key}
              returnCompletedQuestion={this.returnCompletedQuestion}
              removeQuestionFromList={this.removeQuestionFromList}
              stopSurvey={this.stopSurvey}
              returnSelectionKnockout={this.props.returnSelectionKnockout}
              returnKnockout={this.props.returnKnockout}
              removeKnockoutFromList={this.props.removeKnockoutFromList}
              answer={this.returnAnswer(key)}
            />
          );
        })}
        <CaseModal
          isModalOpen={this.state.caseModalOpen}
          buttonContent="Close Case"
          title="Close the case"
          closeModal={() => this.setState({ caseModalOpen: false })}
          reasonText="Reason for closing the case:"
          modalHeight="450"
          text={this.state.knockoutQuestion.knockoutText}
        />
      </div>
    );
  }
}
