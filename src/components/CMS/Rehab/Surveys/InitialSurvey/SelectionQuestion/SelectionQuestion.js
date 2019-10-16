import React, { Component } from "react";
import QuestionText from "../../QuestionText/QuestionText";
import { Checkbox } from "components/Common";

import "./SelectionQuestion.scss";

export default class SelectionQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      question: props.question !== undefined ? props.question : {}
    };
  }

  componentWillReceiveProps({ answer }) {
    if (answer !== undefined) this.setState({ selectedItems: answer });
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

  clearValues = () => {
    this.setState({ selectedItems: [] }, () => this.returnUpdatedQuestion());
  };

  question = () => {
    return {
      type: "selection",
      selectionAnswers: this.state.selectedItems,
      ...this.state.question
    };
  };

  returnUpdatedQuestion = () => {
    this.props.returnUpdatedQuestion(this.question());
  };

  render() {
    const { question, selectedItems } = this.state;
    return (
      <div className="selection-question">
        <QuestionText
          index={question.questionId}
          questionText={question.questionText}
          answered={selectedItems.length !== 0}
        />
        <div className="selection-question__options">
          {question.options.map((option, key) => (
            <div key={key} className="selection-question__option">
              <Checkbox
                label={option}
                checked={selectedItems.includes(option)}
                onChange={() => this.handleChecked(option)}
                id={`initialSurveySelectionQuestionCheckbox${++key}`}
              />
            </div>
          ))}
        </div>
        <div className="selection-question__clear-options">
          <p
            onClick={() => this.clearValues(question)}
            id="initialSurveySelectionQuestionClearBtn"
          >
            Clear
          </p>
        </div>
      </div>
    );
  }
}
