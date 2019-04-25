import React, { Component } from "react";
import Answer from "./Answer";

import "./MultiChoice.scss";

export default class MultiChoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAnswer: ""
    };
  }

  question = () => {
    return {
      question: this.props.question,
      answer: this.state.selectedAnswer,
      id: this.props.question.questionId
    };
  };

  handleChange = answer => {
    this.setState({ selectedAnswer: answer }, () => {
      this.props.markComplete(this.state.selectedAnswer !== "");
      this.props.returnQuestion(this.question());
    });
  };

  clearAnswer = () => {
    this.setState({ selectedAnswer: "" }, () => {
      this.props.markComplete(false);
      this.props.returnQuestion(this.question());
    });
  };

  render() {
    return (
      <div className="multichoice">
        {this.props.question.answers.map((answer, key) => (
          <Answer
            key={key}
            label={answer}
            groupName="btnGroup"
            value={answer}
            onChange={() => this.handleChange(answer)}
            checked={this.state.selectedAnswer === answer}
          />
        ))}
        <p className="multichoice__clear" onClick={this.clearAnswer}>
          Clear
        </p>
      </div>
    );
  }
}
