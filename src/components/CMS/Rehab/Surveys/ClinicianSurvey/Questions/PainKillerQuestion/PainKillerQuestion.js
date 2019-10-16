import React, { Component } from "react";
import QuestionText from "../../../QuestionText/QuestionText";
import { Checkbox, Form, TextArea } from "components/Common";
import "./PainKillerQuestion.scss";

export default class PainKillerQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: props.question !== undefined ? props.question : {},
      questionGroup:
        props.questionGroup !== undefined ? props.questionGroup : {},
      selectedItems: props.answer !== undefined ? props.answer : [],
      additionalInfo:
        props.additionalInfo !== undefined ? props.additionalInfo : ""
    };
  }

  componentWillReceiveProps({ answer, additionalInfo }) {
    if (answer !== undefined)
      this.setState({ selectedItems: answer, additionalInfo });
  }

  handleChange = e => this.setState({ additionalInfo: e.target.value });

  handleChecked = option => {
    const isChecked = this.state.selectedItems.includes(option);

    if (isChecked) {
      const updatedSelection = this.state.selectedItems.filter(
        m => m !== option
      );
      this.setState({ selectedItems: updatedSelection }, () =>
        this.returnUpdatedQuestion()
      );
    } else {
      this.setState(
        { selectedItems: this.state.selectedItems.concat(option) },
        () => this.returnUpdatedQuestion()
      );
    }
  };

  question = () => {
    return {
      type: "selection",
      questionGroup: this.state.questionGroup,
      additionalInfo: this.state.additionalInfo,
      selectionAnswers: this.state.selectedItems,
      questionId: this.state.question.questionId,
      questionGroupId: this.state.questionGroup.id,
      questionText: this.state.question.questionText
    };
  };

  returnUpdatedQuestion = () => {
    this.props.returnUpdatedQuestion(this.question());
  };

  clearValues = () => {
    this.setState({ selectedItems: [] }, () => this.returnUpdatedQuestion());
  };

  render() {
    const { question, selectedItems, additionalInfo } = this.state;
    return (
      <div
        className="painkiller-question"
        id="clinicianSurveyPainKillerQuestion"
      >
        <QuestionText
          index={question.questionId}
          questionText={question.questionText}
          answered={selectedItems.length !== 0}
        />
        <div className="painkiller-question__options">
          {question.options.map((option, key) => {
            const parsedOption = option.replace(/\s/g, "");
            return (
              <div key={key} className="painkiller-question__option">
                <Checkbox
                  label={option}
                  checked={selectedItems.includes(option)}
                  onChange={() => this.handleChecked(option)}
                  id={`clinicianSurveyPainKillerCheckbox_${parsedOption}`}
                />
              </div>
            );
          })}
        </div>
        <div className="painkiller-question__clear-options">
          <p
            id="initialSurveySelectionQuestionClearBtn"
            onClick={() => this.clearValues(question)}
          >
            Clear
          </p>
        </div>
        <Form>
          <p>Additional Information:</p>
          <TextArea
            value={additionalInfo}
            onChange={this.handleChange}
            onBlur={this.returnUpdatedQuestion}
            id="clinicianSurveyPainKillersTextBox"
            placeholder="Any further information relevant to the case"
          />
        </Form>
      </div>
    );
  }
}
