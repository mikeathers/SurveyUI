import React, { Component } from "react";
import PainKillerList from "./PainKillerList/PainKillerList";
import { Form, TextArea } from "components/Common";

export default class CurrentPainKillers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: "",
      otherPainKillers: "",
      completedPainKillers: [],
      showValidationWarning: false
    };
  }

  componentWillReceiveProps({
    valid,
    otherPainKillers,
    completedPainKillers,
    showValidationWarning
  }) {
    this.setState({
      valid,
      otherPainKillers,
      completedPainKillers,
      showValidationWarning
    });
  }

  returnSelectedPainKillers = selectedPainKillers => {
    this.props.returnSelectedPainKillers(selectedPainKillers);
  };

  handleChange = (e, { value }) => {
    this.setState({ otherPainKillers: value });
    this.props.returnOtherPainKillers(value);
  };

  render() {
    return (
      <div id="dischargeSurveyCurrentPainKillers">
        <p className="strong">Current Pain Killers:</p>
        <PainKillerList
          valid={this.state.valid}
          id="dischargeSurveyCurrentPainKillerList"
          completedPainKillers={this.state.completedPainKillers}
          showValidationWarning={this.state.showValidationWarning}
          returnSelectedPainKillers={this.returnSelectedPainKillers}
        />
        <p>Other:</p>
        <Form>
          <TextArea
            onChange={this.handleChange}
            placeholder="Other painkillers"
            value={this.state.otherPainKillers}
          />
        </Form>
      </div>
    );
  }
}
