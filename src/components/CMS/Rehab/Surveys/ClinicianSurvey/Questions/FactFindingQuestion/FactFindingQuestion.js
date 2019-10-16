import React, { Component } from "react";
import QuestionText from "../../../QuestionText/QuestionText";
import { Form, TextArea, RadioButton } from "components/Common";

export default class FactFindingQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: props.question !== undefined ? props.question : null,
      questionGroup:
        props.questionGroup !== undefined ? props.questionGroup : null,
      additionalInfo:
        props.additionalInfo !== undefined ? props.additionalInfo : "",
      selectedAnswer: props.answer !== undefined ? props.answer : ""
    };
  }

  componentWillReceiveProps({ answer, additionalInfo }) {
    if (answer !== undefined) {
      this.setState({ selectedAnswer: answer, additionalInfo });
    }
  }

  question = () => {
    return {
      type: "yesno",
      yesNoAnswer: this.state.selectedAnswer,
      questionGroup: this.state.questionGroup,
      additionalInfo: this.state.additionalInfo,
      questionId: this.state.question.questionId,
      questionGroupId: this.state.questionGroup.id,
      questionText: this.state.question.questionText
    };
  };

  returnUpdatedQuestion = () => {
    this.props.returnUpdatedQuestion(this.question());
  };

  handleChange = e => this.setState({ additionalInfo: e.target.value });

  handleChecked = selectedAnswer => {
    this.setState({ selectedAnswer }, () => this.returnUpdatedQuestion());
  };

  render() {
    const { question, selectedAnswer, additionalInfo } = this.state;
    return (
      <div
        className="clinician-question"
        id="clinicianSurveyFactFindingQuestion"
      >
        <div>
          <QuestionText
            index={question.questionId}
            answered={selectedAnswer !== ""}
            questionText={question.questionText}
          />

          <div className="clinician-question__yesNoButtons">
            <RadioButton
              label="Yes"
              id="clinicianSurveyFactFindingYesRadioBtn"
              onChange={() => this.handleChecked("Yes")}
              checked={this.state.selectedAnswer === "Yes"}
            />
            <RadioButton
              label="No"
              id="clinicianSurveyFactFindingNoRadioBtn"
              onChange={() => this.handleChecked("No")}
              checked={this.state.selectedAnswer === "No"}
            />
          </div>

          <div>
            <p>
              <span className="clinician-question__referral">Refer to:</span>{" "}
              Clinicians best judgement (A&E, GP, Face to face, or Mi3D)
            </p>
          </div>
        </div>

        <Form>
          <p>Additional Information:</p>
          <TextArea
            value={additionalInfo}
            onChange={this.handleChange}
            onBlur={this.returnUpdatedQuestion}
            id="clinicianSurveyFactFindingTextBox"
            placeholder="Any further information relevant to the case"
          />
        </Form>
      </div>
    );
  }
}
