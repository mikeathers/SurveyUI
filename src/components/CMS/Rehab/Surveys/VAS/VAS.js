import React, { Component } from "react";
import { Card, Input, Label } from "components/Common";

import {
  validateItem,
  validateItems,
  setItemToValidate,
  validateListOfStrings,
  removeValidationErrors
} from "helpers/validation";

import "./VAS.scss";

export default class VAS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      painScores: props.painScores !== undefined ? props.painScores : [],
      surveyComplete:
        props.surveyComplete !== undefined ? props.surveyComplete : false,
      completedPainScores:
        props.completedPainScores !== undefined ? props.completedPainScores : []
    };

    this.validateItem = validateItem.bind(this);
    this.validateItems = validateItems.bind(this);
    this.setItemToValidate = setItemToValidate.bind(this);
    this.validateListOfStrings = validateListOfStrings.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }

  componentWillReceiveProps({
    painScores,
    surveyType,
    surveyComplete,
    vasListToValidate,
    completedPainScores,
    showValidationWarning
  }) {
    if (completedPainScores !== undefined)
      this.setState({ completedPainScores });

    if (painScores !== undefined) this.setState({ painScores });

    if (surveyType !== "SOAP") {
      if (surveyComplete) this.setState({ surveyComplete });
    } else this.setState({ surveyComplete: false });

    if (
      painScores.length > 0 &&
      this.state[painScores[0].bodyPart] === undefined
    )
      this.addPainScoresToState(painScores);

    this.handleListToValidate(vasListToValidate);
    this.handleShowValidationWarning(vasListToValidate, showValidationWarning);
  }

  handleShowValidationWarning = (vasListToValidate, showValidationWarning) => {
    if (!showValidationWarning) {
      this.removeValidationErrors(vasListToValidate);
      vasListToValidate.forEach(item => {
        const itemIsValid = `${Object.keys(item)[0]}IsValid`;
        this.setState({ [itemIsValid]: true });
      });
    } else {
      vasListToValidate.forEach(item => {
        const itemIsValid = `${Object.keys(item)[0]}IsValid`;
        this.setState({ [itemIsValid]: false });
      });
    }
  };

  handleListToValidate = vasListToValidate => {
    if (vasListToValidate !== undefined) {
      vasListToValidate.forEach(item => {
        const painScoreItem = Object.keys(item)[0];
        if (this.state[painScoreItem] === undefined)
          this.setState({ [painScoreItem]: "" }, () => {
            const itemIsValid = `${Object.keys(item)[0]}IsValid`;
            this.state[painScoreItem] === ""
              ? this.setState({ [itemIsValid]: false })
              : this.setState({ [itemIsValid]: true });
          });
      });
    }
  };

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    if (value <= 10 && value >= 0) {
      this.setState({ [name]: value });
      const currentPainScore = { bodyPart: name, painScore: value };
      this.props.getCurrentPainScore(currentPainScore);
    }
  };

  addPainScoresToState = painScores => {
    painScores.forEach(painScore => {
      this.setState({ [painScore.bodyPart]: "" });
    });
  };

  renderPainScores = () => {
    return (
      <div id="soapSurveyVASScores">
        {this.state.painScores.map((painScore, key) => (
          <div
            key={key}
            id="soapSurveyVASScore"
            className="soap-survey-vas__content"
          >
            <p>{painScore.bodyPart}</p>
            <p>{painScore.initialPainScore}</p>

            {this.state.surveyComplete ? (
              <Label text={this.state[painScore.bodyPart]} />
            ) : (
              <Input
                width="15"
                type="number"
                placeholder="Score..."
                name={painScore.bodyPart}
                onChange={this.handleChange}
                value={this.state[painScore.bodyPart]}
                id="soapSurveyCurrentPainScoreTextBox"
                valid={this.validateItem(painScore.bodyPart).toString()}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  renderCompletedPainScores = () => {
    return (
      <div id="soapSurveyCompletedVASScores">
        {this.state.completedPainScores.map((painScore, key) => (
          <div
            key={key}
            id="soapSurveyCompletedVASScore"
            className="soap-survey-vas__content"
          >
            <p>{painScore.bodyPart}</p>
            <p>{painScore.initialPainScore}</p>
            <p>{painScore.currentPainScore}</p>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { surveyComplete } = this.state;
    return (
      <Card
        id="soapSurveyVAS"
        title="Visual Analog Score"
        disabled={surveyComplete}
      >
        <div className="soap-survey-vas">
          <div className="soap-survey-vas__header">
            <p>Body Part</p>
            <p>Initial Pain Score</p>
            <p>Current Pain Score</p>
          </div>
          {surveyComplete
            ? this.renderCompletedPainScores()
            : this.renderPainScores()}
        </div>
      </Card>
    );
  }
}
