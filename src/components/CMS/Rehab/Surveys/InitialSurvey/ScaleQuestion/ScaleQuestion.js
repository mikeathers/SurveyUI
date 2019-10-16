import React, { Component } from "react";
import Slider from "rc-slider";
import QuestionText from "../../QuestionText/QuestionText";

import "rc-slider/assets/index.css";
import "./ScaleQuestion.scss";

export default class ScaleQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultValue: 0,
      question: props.question !== undefined ? props.question : {},
      slideValue: props.answer !== undefined ? props.answer : 0
    };
  }

  componentWillReceiveProps({ answer }) {
    if (answer !== undefined) this.setState({ slideValue: answer });
  }

  handleSlide = slideValue => {
    this.setState({ slideValue }, () => this.returnUpdatedQuestion());
  };

  clearSlider = () => {
    this.setState({ defaultValue: 0, slideValue: 0 }, () =>
      this.returnUpdatedQuestion()
    );
  };

  question = () => {
    return {
      type: "scale",
      scaleAnswer: this.state.slideValue,
      ...this.state.question
    };
  };

  returnUpdatedQuestion = () => {
    this.props.returnUpdatedQuestion(this.question());
  };

  render() {
    const { question, slideValue, defaultValue } = this.state;
    return (
      <div className="scale-question">
        <QuestionText
          answered={slideValue !== 0}
          index={question.questionId}
          questionText={question.questionText}
        />
        <p
          className="scale-question__slide-value"
          id="initialSurveyScaleQuestionValueText"
        >
          {slideValue === 0 ? defaultValue : slideValue}
        </p>
        <Slider
          min={0}
          max={10}
          onChange={this.handleSlide}
          id="initialSurveyScaleQuestionSlider"
          value={slideValue === 0 ? defaultValue : slideValue}
        />
        <p
          onClick={this.clearSlider}
          className="scale-question__clear"
          id="initialSurveyScaleQuestionClearBtn"
        >
          Clear
        </p>
      </div>
    );
  }
}
