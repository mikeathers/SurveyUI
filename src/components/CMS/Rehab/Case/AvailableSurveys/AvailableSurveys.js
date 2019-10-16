import React, { Component } from "react";
import { Card } from "components/Common";
import Survey from "./Survey";

import "./AvailableSurveys.scss";

export default class AvailableSurveys extends Component {
  constructor(props) {
    super(props);
    this.state = {
      soapSurveys: null,
      initialSurvey: null,
      dischargeSurvey: null,
      clinicianSurvey: null,
      mi3dCase: props.mi3dCase !== undefined ? props.mi3dCase : {}
    };
  }

  componentDidMount() {
    this._mounted = true;
    setTimeout(() => this.addSurveysToState(), 1000);
  }

  componentWillUnmount() {
    this._mounted = false;
    this.resetSurveys();
  }

  componentWillReceiveProps({ mi3dCase }) {
    this.setState({ mi3dCase });
  }

  addSurveysToState = () => {
    if (this._mounted) {
      const initialSurvey = this.state.mi3dCase.completedInitialSurvey;
      initialSurvey !== undefined && this.setState({ initialSurvey });

      const clinicianSurvey = this.state.mi3dCase.completedClinicianSurvey;
      clinicianSurvey !== undefined && this.setState({ clinicianSurvey });

      const soapSurveys = this.state.mi3dCase.completedSOAPSurveys;
      soapSurveys.length > 0 && this.setState({ soapSurveys });

      const dischargeSurvey = this.state.mi3dCase.completedDischargeSurvey;
      dischargeSurvey !== undefined && this.setState({ dischargeSurvey });
    }
  };

  getCompletedByForSurvey = type => {
    switch (type) {
      case "Initial":
        return (
          this.state.initialSurvey !== null &&
          this.state.initialSurvey.completedBy
        );
      case "Clinician":
        return (
          this.state.clinicianSurvey !== null &&
          this.state.clinicianSurvey.completedBy
        );
      case "SOAP":
        return (
          this.state.soapSurveys !== null &&
          this.state.soapSurveys[0].completedBy
        );
      case "Discharge":
        return (
          this.state.dischargeSurvey !== null &&
          this.state.dischargeSurvey.completedBy
        );
      default:
        return null;
    }
  };

  exerciseStartDateHasBeenCaptured = () => {
    const exerciseStartDate = this.props.mi3dCase.exerciseStartDate;
    return exerciseStartDate !== "0001-01-01T00:00:00" ? true : false;
  };

  caseClosed = () => {
    return this.props.mi3dCase.status.includes("Closed");
  };

  surveys = () => {
    return [
      {
        id: "availableInitialSurvey",
        name: "Initial",
        path: `/cms/rehab/survey/initial/${this.props.bluedogCaseRef}`,
        completed: this.state.initialSurvey !== null,
        completedBy: this.getCompletedByForSurvey("Initial"),
        available: true
      },
      {
        id: "availableClinicianSurvey",
        name: "Clinician",
        path: `/cms/rehab/survey/clinician/${this.props.bluedogCaseRef}`,
        completed: this.state.clinicianSurvey !== null,
        completedBy: this.getCompletedByForSurvey("Clinician"),
        available:
          (this.state.clinicianSurvey !== null &&
            this.state.clinicianSurvey.completedBy !== null) ||
          (this.state.initialSurvey !== null && !this.caseClosed())
      },
      {
        id: "availableSoapSurvey",
        name: "SOAP",
        path: `/cms/rehab/survey/soap/${this.props.bluedogCaseRef}`,
        completed: this.state.soapSurveys !== null,
        completedBy: this.getCompletedByForSurvey("SOAP"),
        available:
          this.state.clinicianSurvey !== null &&
          this.exerciseStartDateHasBeenCaptured()
      },
      {
        id: "availableDischargeSurvey",
        name: "Discharge",
        completed: this.state.dischargeSurvey !== null,
        completedBy: this.getCompletedByForSurvey("Discharge"),
        path: `/cms/rehab/survey/discharge/${this.props.bluedogCaseRef}`,
        available:
          this.state.clinicianSurvey !== null &&
          this.exerciseStartDateHasBeenCaptured()
      }
    ];
  };

  resetSurveys = () => {
    this.setState({
      initialSurvey: null,
      clinicianSurvey: null,
      soapSurvey: null,
      dischargeSurvey: null
    });
  };

  render() {
    return (
      <Card title="Available Surveys" collapse={false} openByDefault={false}>
        {this.surveys().map((survey, key) => {
          return (
            <Survey
              survey={survey}
              key={key}
              selectSurvey={this.props.selectSurvey}
              id={survey.id}
            />
          );
        })}
      </Card>
    );
  }
}
