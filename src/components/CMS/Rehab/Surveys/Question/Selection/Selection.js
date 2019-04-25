import React, { Component } from "react";
import { Checkbox } from "components/Common";
import "./Selection.scss";

export default class Selection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      receivedProps: false
    };
  }

  componentWillReceiveProps(props) {
    const { answer } = props;
    if (!this.state.receivedProps) {
      if (answer !== undefined && answer.length > 0)
        this.setState({ selectedItems: answer, receivedProps: true });
    }
  }

  isChecked = () => {
    this.state.selectedItems.length !== 0
      ? this.props.isComplete(true)
      : this.props.isComplete(false);

    this.props.returnQuestion(this.question());
  };

  handleChecked = option => {
    const isChecked = this.state.selectedItems.includes(option);

    if (isChecked) {
      const updatedSelection = this.state.selectedItems.filter(
        m => m !== option
      );
      this.setState({ selectedItems: updatedSelection }, () =>
        this.isChecked()
      );
    } else {
      this.setState(
        { selectedItems: this.state.selectedItems.concat(option) },
        () => this.isChecked()
      );
    }
  };

  clearValues = question => {
    this.setState({ selectedItems: [] }, () => {
      this.props.isComplete(false);
      this.props.returnQuestion(this.question());
    });
    this.props.isComplete(false);
    this.props.clearQuestion(question);
  };

  question = () => {
    return {
      question: this.props.question,
      answer: this.state.selectedItems,
      id: this.props.question.questionId
    };
  };

  render() {
    const { selectedItems } = this.state;
    return (
      <div className="selection">
        <div className="selection__options">
          {this.props.question.options.map((option, key) => (
            <div key={key} className="selection__option">
              <Checkbox
                label={option}
                onChange={() => this.handleChecked(option)}
                checked={selectedItems.includes(option)}
              />
            </div>
          ))}
        </div>
        <div className="selection__clear-options">
          <p onClick={() => this.clearValues(this.props.question)}>Clear</p>
        </div>
      </div>
    );
  }
}
