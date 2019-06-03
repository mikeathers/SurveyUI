import React, { Component } from "react";
import { checkIfArrayExistsInAnother } from "helpers/validation";
import Text from "./Text/Text";
import Scale from "./Scale/Scale";
import MultiChoice from "./MultiChoice/MultiChoice";
import QuestionText from "./QuestionText/QuestionText";
import "./Question.scss";
import Selection from "./Selection/Selection";
import YesNo from "./YesNo/YesNo";

export class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      complete: false,
      answer: "",
      question: props.question,
      receivedProps: false
    };
  }

  componentWillReceiveProps({ answer }) {
    this.setState({ answer }, () => {
      if (!this.state.receivedProps) {
        if (answer !== undefined) {
          this.renderCompleted();
          this.setState({ receivedProps: true });
        }
      }
    });
  }

  isComplete = complete => {
    this.setState({ complete });
  };

  validateQuestion = question => {
    switch (question.question.type) {
      case "text":
      case "multichoice":
      case "yesno":
        if (question.answer === "")
          this.props.removeQuestionFromList(question.question.questionId);
        break;
      case "scale":
        if (question.answer === 0)
          this.props.removeQuestionFromList(question.question.questionId);
        break;
      case "selection":
        if (question.answer.length === 0)
          this.props.removeQuestionFromList(question.question.questionId);
        break;
      default:
        break;
    }
  };

  checkKnockout = result => {
    switch (result.question.type) {
      case "yesno":
        if (result.answer === result.question.knockout) {
          if (result.question.instantKnockout)
            this.props.stopSurvey(result.question);
          else this.props.returnKnockout(result);
        } else {
          this.props.removeKnockoutFromList(result);
        }
        break;
      case "selection":
        if (result.answer.length >= 3) {
          this.props.returnSelectionKnockout(true);
        } else {
          this.props.returnSelectionKnockout(false);
        }
        result.question.knockout["knockoutSelection"].forEach(combo => {
          if (checkIfArrayExistsInAnother(combo, result.answer)) {
            this.props.returnSelectionKnockout(true);
          }
        });
        break;
      case "scale":
        if (result.answer <= 3) {
          this.props.returnKnockout(result);
        } else {
          this.props.removeKnockoutFromList(result);
        }
        break;
      default:
        return;
    }
  };

  returnQuestion = result => {
    this.setState({ answer: result.answer });
    this.validateQuestion(result);
    this.checkKnockout(result);
    this.props.returnCompletedQuestion(result);
  };

  clearQuestion = question => {
    this.props.removeQuestionFromList(question.questionId);
  };

  renderQuestionType = question => {
    switch (question.type) {
      case "text":
        return (
          <Text
            question={question}
            isComplete={this.isComplete}
            returnQuestion={this.returnQuestion}
            clearQuestion={this.clearQuestion}
            answer={this.props.answer}
            complete={this.state.complete}
          />
        );
      case "scale":
        return (
          <Scale
            question={question}
            isComplete={this.isComplete}
            returnQuestion={this.returnQuestion}
            clearQuestion={this.clearQuestion}
            answer={this.props.answer}
            complete={this.state.complete}
          />
        );
      case "multichoice":
        return (
          <MultiChoice
            question={question}
            isComplete={this.isComplete}
            returnQuestion={this.returnQuestion}
            clearQuestion={this.clearQuestion}
            answer={this.props.answer}
            complete={this.state.complete}
          />
        );
      case "selection":
        return (
          <Selection
            question={question}
            isComplete={this.isComplete}
            returnQuestion={this.returnQuestion}
            clearQuestion={this.clearQuestion}
            answer={this.props.answer}
            complete={this.state.complete}
          />
        );
      case "yesno":
        return (
          <YesNo
            question={question}
            isComplete={this.isComplete}
            returnQuestion={this.returnQuestion}
            clearQuestion={this.clearQuestion}
            answer={this.props.answer}
            complete={this.state.complete}
          />
        );

      default:
        break;
    }
  };

  renderCompleted = () => {
    const question = this.props.question;
    switch (question.type) {
      case "yesno":
        if (this.state.answer === "" || this.state.answer === undefined)
          this.setState({ complete: false });
        else this.setState({ complete: true });
        break;
      case "scale":
        if (this.state.answer === 0 || this.state.answer === undefined)
          this.setState({ complete: false });
        else this.setState({ complete: true });
        break;
      case "selection":
        if (this.state.answer.length < 1 || this.state.answer === undefined)
          this.setState({ complete: false });
        else this.setState({ complete: true });
        break;
      default:
        return;
    }
  };

  render() {
    const { question, index } = this.props;
    const questionAnswered = this.state.complete
      ? "question-text__number question-text__number--completed"
      : "question-text__number";
    return (
      <div className="question">
        <QuestionText
          questionAnswered={questionAnswered}
          index={index}
          text={question.text}
        />
        {this.renderQuestionType(this.props.question)}
      </div>
    );
  }
}
