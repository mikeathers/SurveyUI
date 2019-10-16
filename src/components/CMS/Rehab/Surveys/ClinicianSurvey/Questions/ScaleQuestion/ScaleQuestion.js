import React, { Component } from "react";
import Slider from "rc-slider";
import QuestionText from "../../../QuestionText/QuestionText";

export default class ScaleQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultValue: 0,
      question: props.question !== undefined ? props.question : {},
      questionGroup:
        props.questionGroup !== undefined ? props.questionGroup : {},
      slideValue: props.answer !== undefined ? props.answer : 0
    };
  }

  componentWillReceiveProps({ answer }) {
    if (answer !== undefined) this.setState({ slideValue: answer });
  }

  handleSlide = slideValue => {
    this.setState({ slideValue }, () => this.returnUpdatedQuestion());
  };

  question = () => {
    return {
      type: "scale",
      scaleAnswer: this.state.slideValue,
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
    const { question, slideValue, defaultValue } = this.state;
    return (
      <div className="clinician-question" id="clinicianSurveyScaleQuestion">
        <div>
          <QuestionText
            answered={slideValue !== 0}
            index={question.questionId}
            questionText={question.questionText}
          />

          <div style={{ marginTop: 10 }}>
            <p id="clinicianSurveyScaleQuestionPreviousScore">
              <span className="clinician-question__referral">
                Previous Score:
              </span>
              {` ${this.props.painScore}`}
            </p>
            <p id="clinicianSurveyScaleQuestionCurrentScore">
              <span className="clinician-question__referral">
                Current Score:
              </span>
              {` ${slideValue}`}
            </p>
          </div>
          <Slider
            min={0}
            max={10}
            style={{ marginTop: 20 }}
            onChange={this.handleSlide}
            id="clinicianSurveyScaleQuestionSlider"
            value={slideValue === 0 ? defaultValue : slideValue}
          />
        </div>
      </div>
    );
  }
}
