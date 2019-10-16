import React, { Component } from "react";
import _ from "lodash";
import * as api from "api";
import { withErrorHandling } from "HOCs";

import { yesNo, bluedogWatchLists } from "helpers/dropdowns";

import {
  validateItems,
  validateItem,
  setItemToValidate,
  validateListOfStrings,
  removeValidationErrors
} from "helpers/validation";

import {
  Card,
  Label,
  Input,
  Button,
  Message,
  FormRow,
  Dropdown,
  FormGroup,
  ButtonContainer
} from "components/Common";

import "./AddStopCaseReason.scss";

export class AddStopCaseReason extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      updatesBluedog: "",
      emailTemplates: [],
      showMessage: false,
      errorMessage: false,
      stopCaseReasonText: "",
      selectedEmailTemplates: [],
      sendsCorrespondence: "",
      selectedBluedogWatchList: "",
      emailTemplatesForDropdown: [],
      selectedStopCaseReasonType: "Close Case"
    };

    this.validateItem = validateItem.bind(this);
    this.validateItems = validateItems.bind(this);
    this.setItemToValidate = setItemToValidate.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.getEmailTemplates();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.hideValidationError();
    this.setState({ [name]: value }, () => {
      if (name === "sendsCorrespondence" && value === false)
        this.setState({ selectedEmailTemplates: [] });
      if (name === "updatesBluedog" && value === false)
        this.setState({ selectedBluedogWatchList: "" });
    });
  };

  listToValidate = () => {
    const listToValidate = [
      { stopCaseReasonText: this.state.stopCaseReasonText },
      {
        sendsCorrespondence: this.state.sendsCorrespondence !== "" ? "true" : ""
      },
      {
        updatesBluedog: this.state.updatesBluedog !== "" ? "true" : ""
      }
    ];

    this.state.sendsCorrespondence &&
      listToValidate.push({
        selectedEmailTemplates:
          this.state.selectedEmailTemplates.length > 0 ? "true" : ""
      });

    this.state.updatesBluedog &&
      listToValidate.push({
        selectedBluedogWatchList: this.state.selectedBluedogWatchList
      });

    return listToValidate;
  };

  getEmailTemplates = async () => {
    const response = await api.getEmailTemplates();
    if (response !== undefined) {
      if (response.status === 200 && this._isMounted) {
        const emailTemplates = _.orderBy(response.data, "name");
        this.setState({ emailTemplates }, () =>
          this.mapEmailTemplatesForDropdown(emailTemplates)
        );
      } else this.props.showErrorModal();
    } else this.props.showErrorModal();
  };

  mapEmailTemplatesForDropdown = templates => {
    const emailTemplatesForDropdown = templates.map((template, key) => ({
      key,
      text: template.name,
      value: template.emailTemplateId
    }));
    this.setState({ emailTemplatesForDropdown });
  };

  mapSelectedEmailTemplates = () => {
    const { selectedEmailTemplates } = this.state;
    return selectedEmailTemplates.map(emailTemplateId => ({
      emailTemplateId
    }));
  };

  stopCaseReason = () => ({
    actionedBy: this.props.username,
    text: this.state.stopCaseReasonText,
    updatesBluedog: this.state.updatesBluedog,
    type: this.state.selectedStopCaseReasonType,
    emailTemplates: this.mapSelectedEmailTemplates(),
    sendsCorrespondence: this.state.sendsCorrespondence,
    bluedogWatchList: this.state.selectedBluedogWatchList
  });

  addStopCaseReason = async () => {
    const response = await api.saveStopCaseReason(this.stopCaseReason());
    if (response !== undefined) {
      if (response.status === 200 && this._isMounted) {
        this.clearForm();
        this.showSuccessMessage("Stop Case Reason successfully added");
        this.props.stopCaseReasonsAdded();
      } else this.showErrorMessage(response.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  validateStopCaseReason = () => {
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) this.addStopCaseReason();
    else this.showValidationError(list);
  };

  clearForm = () => {
    this.hideValidationError();
    this.removeValidationErrors(this.listToValidate());
    this.setState({
      updatesBluedog: "",
      stopCaseReasonText: "",
      sendsCorrespondence: "",
      selectedEmailTemplates: [],
      selectedBluedogWatchList: ""
    });
  };

  showSuccessMessage = message => {
    this.setState({
      message,
      showMessage: true,
      errorMessage: false,
      stopCaseReasonText: "",
      selectedEmailTemplateId: ""
    });
    setTimeout(() => this.setState({ showMessage: false }), 3000);
  };

  showErrorMessage = message => {
    this.setState({
      message,
      showMessage: true,
      errorMessage: true
    });
    setTimeout(() => this.setState({ showMessage: false }), 3000);
  };

  showValidationError = list => {
    this.validateItems(list);
    this.setState({
      showMessage: true,
      errorMessage: true,
      message: "Please fill in all fields before submitting"
    });
  };

  hideValidationError = () => {
    this.setState({
      message: "",
      showMessage: false,
      errorMessage: false
    });
  };

  render() {
    return (
      <Card title="Add Stop Case Reason">
        <FormRow>
          <FormGroup>
            <Label text="Stop Case Reason:" />
            <Input
              fullWidth
              id="stopCaseReasonText"
              name="stopCaseReasonText"
              onChange={this.handleChange}
              value={this.state.stopCaseReasonText}
              placeholder="Claimant doesnt want to proceed"
              valid={this.validateItem("stopCaseReasonText").toString()}
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup>
            <Label text="Sends Correspondence?" />
            <Dropdown
              fullWidth
              selection
              options={yesNo}
              id="sendsCorrespondence"
              name="sendsCorrespondence"
              onChange={this.handleChange}
              placeholder="Select Value..."
              value={this.state.sendsCorrespondence}
              valid={this.validateItem("sendsCorrespondence").toString()}
            />
          </FormGroup>
        </FormRow>
        {this.state.sendsCorrespondence && (
          <FormRow>
            <FormGroup>
              <Label text="Email Template:" />
              <Dropdown
                multiple
                fullWidth
                selection
                id="selectedEmailTemplates"
                onChange={this.handleChange}
                name="selectedEmailTemplates"
                placeholder="Select Reason..."
                value={this.state.selectedEmailTemplates}
                options={this.state.emailTemplatesForDropdown}
                valid={this.validateItem("selectedEmailTemplates").toString()}
              />
            </FormGroup>
          </FormRow>
        )}
        <FormRow>
          <FormGroup>
            <Label text="Updates Bluedog?" />
            <Dropdown
              fullWidth
              selection
              options={yesNo}
              id="updatesBluedog"
              name="updatesBluedog"
              onChange={this.handleChange}
              placeholder="Select Value..."
              value={this.state.updatesBluedog}
              valid={this.validateItem("updatesBluedog").toString()}
            />
          </FormGroup>
        </FormRow>
        {this.state.updatesBluedog && (
          <FormRow>
            <FormGroup>
              <Label text="Bluedog Watch List:" />
              <Dropdown
                fullWidth
                selection
                options={bluedogWatchLists}
                onChange={this.handleChange}
                id="selectedBluedogWatchList"
                name="selectedBluedogWatchList"
                placeholder="Select Watch List..."
                value={this.state.selectedBluedogWatchList}
                valid={this.validateItem("selectedBluedogWatchList").toString()}
              />
            </FormGroup>
          </FormRow>
        )}
        <ButtonContainer justifyContent="flex-end" marginTop="15">
          <Message
            marginRight={45}
            message={this.state.message}
            show={this.state.showMessage}
            error={this.state.errorMessage}
            id="addStopCaseReasonErrorMessage"
          />
          <Button content="Cancel" secondary onClick={this.clearForm} />
          <Button
            primary
            content="Add Reason"
            id="addStopCaseReasonBtn"
            onClick={this.validateStopCaseReason}
          />
        </ButtonContainer>
      </Card>
    );
  }
}

export default withErrorHandling(AddStopCaseReason);
