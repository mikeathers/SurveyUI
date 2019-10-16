import React, { Component } from "react";
import QuestionText from "../../../QuestionText/QuestionText";
import { Form, TextArea, Dropdown } from "components/Common";

export default class DropdownQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: props.question !== undefined ? props.question : null,
      questionGroup:
        props.questionGroup !== undefined ? props.questionGroup : null,
      additionalInfo:
        props.additionalInfo !== undefined ? props.additionalInfo : "",
      dropdownAnswer:
        props.dropdownAnswer !== undefined ? props.dropdownAnswer : ""
    };
  }

  componentWillReceiveProps({ dropdownAnswer, additionalInfo }) {
    if (dropdownAnswer !== undefined) this.setState({ dropdownAnswer });
    if (additionalInfo !== undefined) this.setState({ additionalInfo });
  }

  question = () => {
    return {
      type: "dropdown",
      questionGroup: this.state.questionGroup,
      dropdownAnswer: this.state.dropdownAnswer,
      additionalInfo: this.state.additionalInfo,
      questionId: this.state.question.questionId,
      questionGroupId: this.state.questionGroup.id,
      questionText: this.state.question.questionText
    };
  };

  returnUpdatedQuestion = () => {
    this.props.returnUpdatedQuestion(this.question());
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleDropdownChange = (e, { name, value }) => {
    this.setState({ [name]: value }, () => this.returnUpdatedQuestion());
  };

  render() {
    const { question, additionalInfo, dropdownAnswer } = this.state;
    return (
      <div className="clinician-question" id="clinicianSurveyDropdownQuestion">
        <div>
          <QuestionText
            index={question.questionId}
            answered={dropdownAnswer !== ""}
            questionText={question.questionText}
          />

          <div className="clinician-question__dropdown">
            <Dropdown
              selection
              name="dropdownAnswer"
              value={dropdownAnswer}
              options={question.options}
              placeholder="Select answer..."
              onChange={this.handleDropdownChange}
              id="clinicianSurveyDropdownDropdown"
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
            name="additionalInfo"
            value={additionalInfo}
            onChange={this.handleChange}
            onBlur={this.returnUpdatedQuestion}
            id="clinicianSurveyDropdownTextBox"
            placeholder="Any further information relevant to the case"
          />
        </Form>
      </div>
    );
  }
}
