import React, { Component } from "react";
import { Card } from "components/Common";
import Survey from "./Survey";

import "./AvailableSurveys.scss";

export default class AvailableSurveys extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialSurvey: null
    };
  }

  componentDidMount() {
    setTimeout(() => this.addSurveysToState(), 200);
  }

  componentWillUnmount() {
    this.setState({ initialSurvey: null });
  }

  getCompletedBy = type => {
    switch (type) {
      case "Initial":
        return (
          this.state.initialSurvey !== null &&
          this.state.initialSurvey.completedBy
        );
      default:
        return null;
    }
  };

  surveys = () => {
    return [
      {
        name: "Initial",
        path: `/cms/rehab/survey/initial/${this.props.bluedogCaseRef}`,
        completed: this.state.initialSurvey !== null ? true : false,
        completedBy: this.getCompletedBy("Initial")
      },
      {
        name: "Clinician",
        completed: false,
        path: `/cms/rehab/survey/clinician/${this.props.bluedogCaseRef}`
      },
      {
        name: "SOAP",
        completed: false,
        path: `/cms/rehab/survey/soap/${this.props.bluedogCaseRef}`
      },
      {
        name: "Customer Satisfaction",
        completed: false,
        path: `/cms/rehab/survey/customersatisfaction/${
          this.props.bluedogCaseRef
        }`
      }
    ];
  };

  addSurveysToState = () => {
    if (
      this.props.mi3dCase.completedSurveys !== undefined &&
      this.props.mi3dCase.completedSurveys.length > 0
    ) {
      const initialSurvey = this.props.mi3dCase.completedSurveys.find(
        m => m.type === "Initial"
      );
      initialSurvey !== undefined && this.setState({ initialSurvey });
    }
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
              id={++key}
            />
          );
        })}
      </Card>
    );
  }
}
