import React, { Component } from "react";
import QuestionText from "../../../QuestionText/QuestionText";

import { Form, TextArea } from "components/Common";

export default class FreeTextQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: props.question !== undefined ? props.question : null,
      questionGroup:
        props.questionGroup !== undefined ? props.questionGroup : null,
      answer: props.answer !== undefined ? props.answer : ""
    };
  }

  componentWillReceiveProps({ answer }) {
    if (answer !== undefined) this.setState({ answer });
  }

  handleChange = e => this.setState({ answer: e.target.value });

  question = () => {
    return {
      type: "text",
      textAnswer: this.state.answer,
      questionGroup: this.state.questionGroup,
      questionId: this.state.question.questionId,
      questionGroupId: this.state.questionGroup.id,
      questionText: this.state.question.questionText
    };
  };

  returnUpdatedQuestion = () => {
    this.props.returnUpdatedQuestion(this.question());
  };

  render() {
    const { question, answer } = this.state;
    return (
      <div className="clinician-question" id="clinicianSurveyFreeTextQuestion">
        <QuestionText
          answered={answer !== ""}
          index={question.questionId}
          questionText={question.questionText}
        />
        <Form>
          <p>Answer:</p>
          <TextArea
            value={answer}
            onChange={this.handleChange}
            onBlur={this.returnUpdatedQuestion}
            id="clinicianSurveyFreeTextTextBox"
            placeholder="Any further information relevant to the case"
          />
        </Form>
      </div>
    );
  }
}
