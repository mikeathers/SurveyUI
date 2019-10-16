import React, { Component } from "react";
import { Card } from "components/Common";
import InitialPainKillers from "./InitialPainKillers/InitialPainKillers";

import "./PainKillers.scss";
import CurrentPainKillers from "./CurrentPainKillers/CurrentPainKillers";

export default class PainKillers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: "",
      otherPainKillers: "",
      surveyComplete: false,
      completedPainKillers: [],
      showValidationWarning: false
    };
  }

  componentWillReceiveProps({
    valid,
    surveyComplete,
    otherPainKillers,
    completedPainKillers,
    showValidationWarning
  }) {
    this.setState({
      valid,
      surveyComplete,
      otherPainKillers,
      completedPainKillers,
      showValidationWarning
    });
  }

  returnSelectedPainKillers = selectedPainKillers => {
    this.props.returnSelectedPainKillers(selectedPainKillers);
  };

  returnOtherPainKillers = otherPainKillers => {
    this.props.returnOtherPainKillers(otherPainKillers);
  };

  render() {
    const { initialPainKillers } = this.props;
    return (
      <Card
        title="Pain Medication"
        id="dischargeSurveyPainKillers"
        disabled={this.state.surveyComplete}
      >
        <div className="discharge-survey-pain-killers">
          <InitialPainKillers
            painKillers={initialPainKillers}
            id="dischargeSurveyInitialPainKillers"
          />
          <CurrentPainKillers
            valid={this.state.valid}
            id="dischargeSurveyCurrentPainKillers"
            otherPainKillers={this.state.otherPainKillers}
            returnOtherPainKillers={this.returnOtherPainKillers}
            completedPainKillers={this.state.completedPainKillers}
            showValidationWarning={this.state.showValidationWarning}
            returnSelectedPainKillers={this.returnSelectedPainKillers}
          />
        </div>
      </Card>
    );
  }
}
