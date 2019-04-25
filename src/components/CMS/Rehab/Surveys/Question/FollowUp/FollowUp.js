import React, { Component } from "react";
import "./FollowUp.scss";
import Answer from "../MultiChoice/Answer";
export default class FollowUp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="followup">
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
        <p className="followup__clear" onClick={this.clearAnswer}>
          Clear
        </p>
      </div>
    );
  }
}
