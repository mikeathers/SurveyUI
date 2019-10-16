import React, { Component } from "react";
import QuestionText from "../../../QuestionText/QuestionText";
import { Form, TextArea, RadioButton } from "components/Common";

export default class FollowUpQuestion extends Component {
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

  handleChange = e => this.setState({ additionalInfo: e.target.value });

  handleFollowUpToDisplay = followUp => {
    this.props.returnFollowUpToDisplay(followUp);
  };

  handleChecked = (selectedAnswer, followUp) => {
    this.setState({ selectedAnswer }, () => {
      this.returnUpdatedQuestion();
      if (selectedAnswer === "Yes")
        this.props.returnFollowUpToDisplay(followUp);
    });
  };

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

  render() {
    const { question, selectedAnswer, additionalInfo } = this.state;
    return (
      <div className="clinician-question" id="clinicianSurveyFollowUpQuestion">
        <div>
          <QuestionText
            index={question.questionId}
            answered={selectedAnswer !== ""}
            questionText={question.questionText}
          />

          <div className="clinician-question__yesNoButtons">
            <RadioButton
              label="Yes"
              id="clinicianSurveyFollowUpYesRadioBtn"
              checked={this.state.selectedAnswer === "Yes"}
              onChange={() => {
                this.handleChecked("Yes", question.followUpToDisplay);
              }}
            />
            <RadioButton
              label="No"
              id="clinicianSurveyFollowUpNoRadioBtn"
              onChange={() => this.handleChecked("No")}
              checked={this.state.selectedAnswer === "No"}
            />
          </div>

          <p className="clinician-question__followup-container">
            <span className="clinician-question__referral">Refer to:</span>{" "}
            <span
              className="clinician-question__followup"
              onClick={() =>
                this.handleFollowUpToDisplay(question.followUpToDisplay)
              }
            >
              Follow up {question.followup}
            </span>
          </p>
        </div>

        <Form>
          <p>Additional Information:</p>
          <TextArea
            value={additionalInfo}
            onChange={this.handleChange}
            onBlur={this.returnUpdatedQuestion}
            id="clinicianSurveyFollowUpAdditionalInfoTextBox"
            placeholder="Any further information relevant to the case"
          />
        </Form>
      </div>
    );
  }
}
