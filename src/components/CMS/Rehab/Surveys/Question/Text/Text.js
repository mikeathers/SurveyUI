import React, { Component } from "react";

import { TextArea, Form } from "components/Common";
import "./Text.scss";

class Text extends Component {
  returnQuestion = e => {
    const question = {
      question: this.props.question,
      answer: e.target.value,
      id: this.props.question.questionId
    };
    this.props.returnQuestion(question);
    this.props.markComplete(e.target.value !== "");
  };
  render() {
    return (
      <div className="text-question">
        <Form>
          <TextArea
            className="question-textarea"
            onBlur={this.returnQuestion}
          />
        </Form>
      </div>
    );
  }
}
export default Text;
