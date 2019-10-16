import React, { Component } from "react";
import { Checkbox } from "components/Common";
import "./PainKillerList.scss";

const options = [
  "Ibuprofen",
  "Paracetomol",
  "Naproxen",
  "Diazepam",
  "Co-codamol",
  "None"
];

export default class PainKillerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: "",
      selectedItems: [],
      completedPainKillers: []
    };
  }

  componentWillReceiveProps({
    valid,
    completedPainKillers,
    showValidationWarning
  }) {
    this.setState({ valid });

    if (completedPainKillers !== undefined)
      this.setState({ completedPainKillers }, () =>
        this.handleCompletedPainKillers()
      );

    if (showValidationWarning)
      if (showValidationWarning) this.setState({ valid: false });
  }

  handleCompletedPainKillers = () => {
    const painKillers = this.state.completedPainKillers;
    if (painKillers.length > 0) {
      const selectedItems = painKillers.map(m => m.name);
      this.setState({ selectedItems });
    }
  };

  handleChecked = option => {
    const isChecked = this.state.selectedItems.includes(option);

    if (isChecked) {
      const updatedSelection = this.state.selectedItems.filter(
        m => m !== option
      );
      this.setState({ selectedItems: updatedSelection }, () =>
        this.props.returnSelectedPainKillers(updatedSelection)
      );
    } else {
      this.setState(
        { selectedItems: this.state.selectedItems.concat(option) },
        () => this.props.returnSelectedPainKillers(this.state.selectedItems)
      );
    }
  };

  render() {
    return (
      <div
        className="painkiller-list"
        id="dischargeSurveyCurrentPainKillerList"
      >
        {options.map((option, key) => (
          <div key={key} className="painkiller-list__option">
            <Checkbox
              label={option}
              className="painkiller-list__check"
              valid={this.state.valid.toString()}
              onChange={() => this.handleChecked(option)}
              checked={this.state.selectedItems.includes(option)}
              id={`dischargeSurveyCurrentPainKillersCheckbox${++key}`}
            />
          </div>
        ))}
      </div>
    );
  }
}
