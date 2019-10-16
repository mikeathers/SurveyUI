import React, { Component } from "react";
import moment from "moment";

import {
  validateItem,
  validateItems,
  setItemToValidate,
  validateListOfStrings,
  removeValidationErrors
} from "helpers/validation";

import { Card, Input, Label } from "components/Common";

import "./PSFSActivities.scss";

export default class PSFSActivities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyComplete: props.surveyComplete ? props.surveyComplete : false,
      psfsActivities:
        props.psfsActivities !== undefined ? props.psfsActivities : [],
      completedPsfsActivities:
        props.completedPsfsActivities !== undefined
          ? props.completedPsfsActivities
          : []
    };

    this.validateItem = validateItem.bind(this);
    this.validateItems = validateItems.bind(this);
    this.setItemToValidate = setItemToValidate.bind(this);
    this.validateListOfStrings = validateListOfStrings.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }

  componentWillReceiveProps({
    surveyType,
    surveyComplete,
    psfsActivities,
    psfsListToValidate,
    showValidationWarning,
    completedPsfsActivities
  }) {
    if (psfsActivities !== undefined) this.setState({ psfsActivities });

    if (completedPsfsActivities !== undefined)
      this.setState({ completedPsfsActivities });

    if (surveyType !== "SOAP") {
      if (surveyComplete) this.setState({ surveyComplete });
    } else this.setState({ surveyComplete: false });

    this.handleListToValidate(psfsListToValidate);

    this.handleShowValidationWarnings(
      showValidationWarning,
      psfsListToValidate
    );

    if (
      psfsActivities.length > 0 &&
      this.state[psfsActivities[0].activity] == undefined
    )
      this.addActivitiesToState(psfsActivities);
  }

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    if (value <= 10 && value >= 0) {
      this.setState({ [name]: value });
      const currentPainScore = { activity: name, painScore: value };
      this.props.getCurrentPsfsPainScores(currentPainScore);
    }
  };

  handleShowValidationWarnings = (
    showValidationWarning,
    psfsListToValidate
  ) => {
    if (!showValidationWarning) {
      this.removeValidationErrors(psfsListToValidate);
      psfsListToValidate.forEach(item => {
        const itemIsValid = `${Object.keys(item)[0]}IsValid`;
        this.setState({ [itemIsValid]: true });
      });
    } else {
      psfsListToValidate.forEach(item => {
        const itemIsValid = `${Object.keys(item)[0]}IsValid`;
        this.setState({ [itemIsValid]: false });
      });
    }
  };

  handleListToValidate = psfsListToValidate => {
    if (psfsListToValidate !== undefined) {
      psfsListToValidate.forEach(item => {
        const activityItem = Object.keys(item)[0];
        if (this.state[activityItem] === undefined)
          this.setState({ [activityItem]: "" }, () => {
            const itemIsValid = `${Object.keys(item)[0]}IsValid`;
            this.state[activityItem] === ""
              ? this.setState({ [itemIsValid]: false })
              : this.setState({ [itemIsValid]: true });
          });
      });
    }
  };

  addActivitiesToState = psfsActivities => {
    psfsActivities.forEach(psfsActivity => {
      this.setState({ [psfsActivity.activity]: "" });
    });
  };

  renderPsfsActivities = () => {
    return (
      <div id="soapSurveyPSFSActivityContainer">
        {this.state.psfsActivities.map((psfsActivity, key) => (
          <div
            id="soapSurveyPSFSActivityContent"
            key={key}
            className="soap-survey-psfs__content"
          >
            <p id="soapSurveyPSFSActivity">{psfsActivity.activity}</p>
            <p id="soapSurveyPSFSInitialScoreDate">
              {moment(psfsActivity.initialScoreDate).format("DD/MM/YYYY")}
            </p>
            <p id="soapSurveyPSFSPainScore">{psfsActivity.painScore}</p>
            {this.state.surveyComplete ? (
              <Label text={this.state[psfsActivity.activity]} />
            ) : (
              <Input
                width="15"
                type="number"
                placeholder="Score..."
                name={psfsActivity.activity}
                onChange={this.handleChange}
                id="soapSurveyCurrentPainScoreTextBox"
                value={this.state[psfsActivity.activity]}
                valid={this.validateItem(psfsActivity.activity).toString()}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  renderCompletePsfsActivities = () => {
    return (
      <div id="soapSurveyCompletedPSFSActivityContainer">
        {this.state.completedPsfsActivities.map((psfsActivity, key) => {
          return (
            <div
              key={key}
              className="soap-survey-psfs__content"
              id="soapSurveyCompletedPSFSActivityContent"
            >
              <p id="soapSurveyPSFSActivity">{psfsActivity.activity}</p>
              <p id="soapSurveyPSFSInitialScoreDate">
                {moment(psfsActivity.initialScoreDate).format("DD/MM/YYYY")}
              </p>
              <p id="soapSurveyPSFSPainScore">
                {psfsActivity.initialPainScore}
              </p>
              <p>{psfsActivity.currentPainScore}</p>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { surveyComplete } = this.state;
    return (
      <Card
        title="PSFS Activities"
        disabled={surveyComplete}
        id="soapSurveyPSFSActivities"
      >
        <div className="soap-survey-psfs">
          <div className="soap-survey-psfs__header">
            <p>Activity</p>
            <p>Initial Score Date</p>
            <p>Initial Score</p>
            <p>Current Score</p>
          </div>
          {surveyComplete
            ? this.renderCompletePsfsActivities()
            : this.renderPsfsActivities()}
        </div>
      </Card>
    );
  }
}
