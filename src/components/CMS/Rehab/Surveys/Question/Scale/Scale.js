import React, { Component } from "react";
import Slider from "rc-slider";

import "rc-slider/assets/index.css";
import "./Scale.scss";

export default class Scale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideValue: 0,
      defaultValue: 0
    };
  }

  componentWillReceiveProps({ answer, complete }) {
    if (complete) {
      this.setState({ defaultValue: answer });
    }
  }

  handleSlide = e => {
    this.setState({ slideValue: e });
  };

  isComplete = () => {
    const question = {
      question: this.props.question,
      answer: this.state.slideValue,
      id: this.props.question.questionId
    };
    const isComplete = this.state.slideValue !== 0;
    this.props.isComplete(isComplete);
    this.props.returnQuestion(question);
  };

  clearSlider = () => {
    this.setState({ defaultValue: 0, slideValue: 0 }, () => {
      const emptyQuestion = {
        question: this.props.question,
        answer: 0,
        id: this.props.question.questionId
      };
      this.props.isComplete(false);
      this.props.returnQuestion(emptyQuestion);
    });
  };

  render() {
    return (
      <div className="scale">
        <p className="scale__slide-value">
          {this.state.slideValue === 0
            ? this.state.defaultValue
            : this.state.slideValue}
        </p>
        <Slider
          min={0}
          max={10}
          value={
            this.state.slideValue === 0
              ? this.state.defaultValue
              : this.state.slideValue
          }
          onChange={this.handleSlide}
          onAfterChange={this.isComplete}
        />
        <p className="scale__clear" onClick={this.clearSlider}>
          Clear
        </p>
      </div>
    );
  }
}
