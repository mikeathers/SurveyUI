import React, { Component } from "react";
import { RadioButton, Dropdown } from "components/Common";

import "./YesNo.scss";

export default class YesNo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAnswer: "",
      answer: "",
      receivedProps: false
    };
  }
  componentWillReceiveProps({ answer }) {
    if (!this.state.receivedProps) {
      if (answer !== undefined) {
        this.setState({ selectedAnswer: answer, receivedProps: true });
      }
    }
  }

  question = () => {
    return {
      question: this.props.question,
      answer: this.state.selectedAnswer,
      id: this.props.question.questionId
    };
  };

  handleChecked = value => {
    this.setState({ selectedAnswer: value }, () => {
      this.props.returnQuestion(this.question());
      this.props.isComplete(this.state.selectedAnswer !== "");
    });
  };

  clearAnswer = () => {
    this.setState({ selectedAnswer: "" }, () => {
      this.props.isComplete(false);
      this.props.returnQuestion(this.question());
    });
  };

  renderFollowup = followup => {
    switch (followup.action) {
      case "showDropdown":
        return (
          <div>
            <p>{followup.question}</p>
            <Dropdown selection options={followup.options} />
          </div>
        );
      default:
        return null;
    }
  };

  render() {
    const { question } = this.props;
    return (
      <div className="yesno">
        <div className="yesno__container">
          <RadioButton
            label="Yes"
            groupName={`${question.questionId}`}
            onChange={() => this.handleChecked("Yes")}
            checked={this.state.selectedAnswer === "Yes"}
          />
          <RadioButton
            label="No"
            groupName={`${question.questionId}`}
            onChange={() => this.handleChecked("No")}
            checked={this.state.selectedAnswer === "No"}
          />
        </div>
        <div className="yesno__clear">
          <p onClick={this.clearAnswer}>Clear</p>
        </div>
        <div className="yesno__followup">
          {question.followup &&
          this.state.selectedAnswer === question.followup.answerToTrigger
            ? this.renderFollowup(question.followup)
            : null}
        </div>
      </div>
    );
  }
}
