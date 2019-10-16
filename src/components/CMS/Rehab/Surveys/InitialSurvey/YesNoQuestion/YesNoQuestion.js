import React, { Component } from "react";
import QuestionText from "../../QuestionText/QuestionText";
import { RadioButton, FlexBox } from "components/Common";
import "./YesNoQuestion.scss";
export default class YesNoQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAnswer: "",
      question: props.question !== undefined ? props.question : {}
    };
  }

  componentWillReceiveProps({ answer }) {
    if (answer !== undefined) this.setState({ selectedAnswer: answer });
  }

  handleChecked = selectedAnswer => {
    this.setState({ selectedAnswer }, () => this.returnUpdatedQuestion());
  };

  handleClear = () => {
    this.setState({ selectedAnswer: "" }, () => this.returnUpdatedQuestion());
  };

  question = () => {
    return {
      type: "yesno",
      answer: this.state.selectedAnswer,
      yesNoAnswer: this.state.selectedAnswer,
      ...this.state.question
    };
  };

  returnUpdatedQuestion = () => {
    this.props.returnUpdatedQuestion(this.question());
  };

  render() {
    return (
      <div className="yesno-question">
        <QuestionText
          index={this.state.question.questionId}
          answered={this.state.selectedAnswer !== ""}
          questionText={this.state.question.questionText}
        />
        <div className="yesno-question__buttons">
          <RadioButton
            label="Yes"
            id="initialSurveyYesRadioBtn"
            onChange={() => this.handleChecked("Yes")}
            checked={this.state.selectedAnswer === "Yes"}
          />
          <RadioButton
            label="No"
            id="initialSurveyNoRadioBtn"
            onChange={() => this.handleChecked("No")}
            checked={this.state.selectedAnswer === "No"}
          />
          {this.state.question.naQuestion && (
            <RadioButton
              label="N/A"
              id="initialSurveyNARadioBtn"
              onChange={() => this.handleChecked("N/A")}
              checked={this.state.selectedAnswer === "N/A"}
            />
          )}
        </div>
        <FlexBox justifyContent="flex-end">
          <p
            onClick={this.handleClear}
            id="initialSurveyClearBtn"
            className="yesno-question__clear"
          >
            Clear
          </p>
        </FlexBox>
      </div>
    );
  }
}
