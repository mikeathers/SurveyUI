import React, { Component } from "react";
import Activity from "./Activity";
import RemoveActivityModal from "./RemoveActivityModal";
import AddActivityForm from "./AddActivityForm";
import { Card } from "components/Common";

import "./PSFSScore.scss";

import {
  validateItems,
  validateItem,
  setItemToValidate,
  validateListOfStrings,
  removeValidationErrors
} from "helpers/validation";

export default class PSFSScore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activity: "",
      painScore: "",
      showMessage: false,
      removeModalOpen: false,
      initialScoreDate: new Date(),
      psfsActivities:
        props.psfsActivities !== undefined ? props.psfsActivities : []
    };

    this.validateItem = validateItem.bind(this);
    this.validateItems = validateItems.bind(this);
    this.setItemToValidate = setItemToValidate.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }

  componentWillReceiveProps({ psfsActivities }) {
    if (psfsActivities !== undefined) this.setState({ psfsActivities });
  }

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.hideErrorMessage();
    if (name === "painScore") {
      if (value <= 10 && value >= 0)
        this.setState({ [name]: value, showMessage: false });
    } else this.setState({ [name]: value, showMessage: false });
  };

  handleDateChange = initialScoreDate => this.setState({ initialScoreDate });

  listToValidate = () => {
    const { activity, painScore } = this.state;
    return [{ activity }, { painScore }];
  };

  activity = () => ({
    id: this.state.psfsActivities.length + 1,
    activity: this.state.activity,
    initialScoreDate: this.state.initialScoreDate,
    painScore: this.state.painScore
  });

  addActivity = () => {
    this.setState(
      {
        psfsActivities: this.state.psfsActivities.concat(this.activity()),
        activity: "",
        painScore: ""
      },
      () => this.props.returnActivities(this.state.psfsActivities)
    );
  };

  validateAddActivity = () => {
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      if (this.state.psfsActivities.length >= 2)
        this.showErrorMessage("No more PSFS activities can be added");
      else {
        this.addActivity();
        this.removeValidation();
      }
    } else {
      this.validateItems(list);
      this.showErrorMessage("Please fill in all the fields before submitting");
    }
  };

  showErrorMessage = message => {
    this.setState({
      message,
      showMessage: true
    });
  };

  hideErrorMessage = () => {
    this.setState({
      message: "",
      showMessage: false
    });
  };

  removeValidation = () => {
    this.hideErrorMessage();
    this.removeValidationErrors(this.listToValidate());
  };

  showRemoveActivityModal = selectedActivity => {
    this.setState({ selectedActivity, removeModalOpen: true });
  };

  removeActivity = () => {
    const { psfsActivities, selectedActivity } = this.state;
    const updatedActivities = psfsActivities.filter(
      m => m.id !== selectedActivity.id
    );
    this.setState({ psfsActivities: updatedActivities }, () =>
      this.props.returnActivities(updatedActivities)
    );
    this.closeRemoveModal();
  };

  closeRemoveModal = () => {
    this.setState({ removeModalOpen: false, selectedActivity: "" });
  };

  render() {
    const {
      message,
      activity,
      painScore,
      showMessage,
      psfsActivities,
      removeModalOpen,
      selectedActivity,
      initialScoreDate
    } = this.state;
    return (
      <div id="psfsScore">
        <Card title="PSFS Assessment" disabled={this.props.disabled}>
          <div>
            <p>PSFS Outcome Measure Score and WAD Score and recommendations</p>
            <p>0 = Unable to perform activity</p>
            <p>10 = Able to perform activity as before injury</p>
          </div>
          <AddActivityForm
            message={message}
            activity={activity}
            painScore={painScore}
            showMessage={showMessage}
            handleChange={this.handleChange}
            validateItem={this.validateItem}
            initialScoreDate={initialScoreDate}
            handleDateChange={this.handleDateChange}
            validateAddActivity={this.validateAddActivity}
          />
          {psfsActivities.length > 0 && (
            <div className="psfsScore__logged-activities">
              <p>Logged Activies:</p>
              <div className="psfsScore__table-header">
                <p>Activity</p>
                <p>Score</p>
                <p>Initial Score Date</p>
              </div>
              {psfsActivities.map((activity, key) => (
                <Activity
                  key={key}
                  activity={activity.activity}
                  painScore={activity.painScore}
                  initialScoreDate={activity.initialScoreDate}
                  removeActivity={() => this.showRemoveActivityModal(activity)}
                />
              ))}
            </div>
          )}
        </Card>
        <RemoveActivityModal
          id="psfsScoreRemoveActivityModal"
          removeModalOpen={removeModalOpen}
          selectedActivity={selectedActivity}
          removeActivity={this.removeActivity}
          closeRemoveModal={this.closeRemoveModal}
        />
      </div>
    );
  }
}
