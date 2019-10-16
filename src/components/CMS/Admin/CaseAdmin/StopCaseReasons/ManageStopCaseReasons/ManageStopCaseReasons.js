import React, { Component } from "react";
import _ from "lodash";
import * as api from "api";
import {withErrorHandling} from "HOCs";

import { yesNo, bluedogWatchLists } from "helpers/dropdowns";

import {
  validateListOfStrings,
  validateItems,
  removeValidationErrors,
  validateItem,
  setItemToValidate
} from "helpers/validation";
import {
  Card,
  Label,
  FormRow,
  FormGroup,
  Dropdown,
  Input,
  Message,
  Button,
  ButtonContainer,
  Modal,
  FlexBox
} from "components/Common";

import "./ManageStopCaseReasons.scss";

class ManageStopCaseReasons extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      updatesBluedog: "",
      showMessage: false,
      stopCaseReasons: [],
      selectedReason: null,
      removeModalOpen: false,
      stopCaseReasonText: "",
      sendsCorrespondence: "",
      selectedEmailTemplates: [],
      selectedBluedogWatchList: "",
      selectedStopCaseReasonId: "",
      emailTemplatesForDropdown: [],
      stopCaseReasonsForDropdown: [],
      selectedStopCaseReasonType: ""
    };
    this.setItemToValidate = setItemToValidate.bind(this);
    this.validateItems = validateItems.bind(this);
    this.validateItem = validateItem.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.getEmailTemplates();
    this.getStopCaseReasons();
  }

  componentWillReceiveProps() {
    this.getStopCaseReasons();
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

  handleReasonChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.setItemToValidate("stopCaseReasonText");
    const selectedReason = this.state.stopCaseReasons.find(
      m => m.stopCaseReasonId === value
    );
    this.setState({
      [name]: value,
      selectedReason,
      stopCaseReasonText: selectedReason.text,
      selectedStopCaseReasonType: selectedReason.type,
      updatesBluedog: selectedReason.updatesBluedog,
      sendsCorrespondence: selectedReason.sendsCorrespondence,
      selectedBluedogWatchList: selectedReason.bluedogWatchList,
      selectedEmailTemplates: this.mapPreSelectedEmailTemplates(
        selectedReason.emailTemplates
      )
    });
  };

  listToValidate = () => {
    const listToValidate = [
      { selectedStopCaseReasonId: this.state.selectedStopCaseReasonId },
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

  getStopCaseReasons = async () => {
    const response = await api.getStopCaseReasons();
    if (response !== undefined) {
      if (response.status === 200 && this._isMounted) {
        const stopCaseReasons = _.orderBy(response.data, "name");
        this.setState({ stopCaseReasons });
        this.mapStopCaseReasonsForDropdown(stopCaseReasons);
      }
    } else this.props.showErrorModal();
  };

  getEmailTemplates = async () => {
    const response = await api.getEmailTemplates();
    if (response !== undefined) {
      if (response.status === 200 && this._isMounted) {
        const emailTemplates = _.orderBy(response.data, "name");
        this.setState({ emailTemplates }, () =>
          this.mapEmailTemplatesForDropdown(emailTemplates)
        );
      }
    } else this.props.showErrorModal();
  };

  mapStopCaseReasonsForDropdown = reasons => {
    const stopCaseReasonsForDropdown = reasons.map((reason, key) => ({
      text: reason.text,
      value: reason.stopCaseReasonId,
      key
    }));
    this.setState({
      stopCaseReasonsForDropdown: _.orderBy(stopCaseReasonsForDropdown, "text")
    });
  };

  mapEmailTemplatesForDropdown = templates => {
    const emailTemplatesForDropdown = templates.map((template, key) => ({
      text: template.name,
      value: template.emailTemplateId,
      key
    }));
    this.setState({ emailTemplatesForDropdown });
  };

  mapPreSelectedEmailTemplates = templates => {
    return templates.map(template => template.emailTemplateId);
  };

  stopCaseReason = () => ({
    actionedBy: this.props.username,
    text: this.state.stopCaseReasonText,
    updatesBluedog: this.state.updatesBluedog,
    type: this.state.selectedStopCaseReasonType,
    emailTemplates: this.mapSelectedEmailTemplates(),
    sendsCorrespondence: this.state.sendsCorrespondence,
    bluedogWatchList: this.state.selectedBluedogWatchList,
    stopCaseReasonId:
      this.state.selectedReason !== null
        ? this.state.selectedReason.stopCaseReasonId
        : 0
  });

  mapSelectedEmailTemplates = () => {
    const { selectedEmailTemplates } = this.state;
    return selectedEmailTemplates.map(emailTemplateId => ({
      emailTemplateId
    }));
  };

  validateStopCaseReason = () => {
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      this.updateStopCaseReason();
    } else {
      this.validateItems(list);
      this.showValidationError(list);
    }
  };

  updateStopCaseReason = async () => {
    const response = await api.saveStopCaseReason(this.stopCaseReason());
    if (response !== undefined) {
      if (response.status === 200 && this._isMounted) {
        this.setState({ stopCaseReasons: response.data });
        this.clearForm();
        this.showSuccessMessage("Stop Case Reason updated successfully");
        this.mapStopCaseReasonsForDropdown(response.data);
      } else this.showErrorMessage(response.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  removeStopCaseReason = async stopCaseReasonId => {
    const removeStopCaseReason = {
      stopCaseReasonId,
      actionedBy: this.props.username
    };
    const response = await api.removeStopCaseReason(removeStopCaseReason);
    if (response !== undefined) {
      if (response.status === 200 && this._isMounted) {
        this.setState({ stopCaseReasons: response.data });
        this.clearForm();
        this.showSuccessMessage("Stop Case Reason removed successfully");
        this.mapStopCaseReasonsForDropdown(response.data);
      } else this.showErrorMessage(response.data[0].errorMessage);
    }
  };

  clearForm = () => {
    this.hideValidationError();
    this.removeValidationErrors(this.listToValidate());
    this.setState({
      updatesBluedog: "",
      stopCaseReasonText: "",
      sendsCorrespondence: "",
      selectedEmailTemplates: [],
      selectedBluedogWatchList: "",
      selectedStopCaseReasonId: ""
    });
  };

  showSuccessMessage = message => {
    this.setState({
      showMessage: true,
      message,
      errorMessage: false,
      removeModalOpen: false,
      stopCaseReasonText: "",
      selectedEmailTemplateId: "",
      selectedStopCaseReasonId: ""
    });
    setTimeout(() => this.setState({ showMessage: false }), 3000);
  };

  showErrorMessage = message => {
    this.setState({
      showMessage: true,
      message,
      errorMessage: true
    });
    setTimeout(() => this.setState({ showMessage: false }), 3000);
  };

  showValidationError = list => {
    this.validateItems(list);
    this.setState({
      message: "Please fill in all fields before submitting",
      errorMessage: true,
      showMessage: true
    });
  };

  hideValidationError = () => {
    this.setState({
      showMessage: false,
      errorMessage: false,
      message: ""
    });
  };

  render() {
    return (
      <Card title="Manage Stop Case Reasons">
        <FormRow>
          <FormGroup>
            <Label text="Stop Case Reason:" />
            <Dropdown
              fullWidth
              selection
              placeholder="Select Stop Case Reason..."
              name="selectedStopCaseReasonId"
              value={this.state.selectedStopCaseReasonId}
              onChange={this.handleReasonChange}
              options={this.state.stopCaseReasonsForDropdown}
              valid={this.validateItem("selectedStopCaseReasonId").toString()}
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup>
            <Label text="Reason Text:" />
            <Input
              fullWidth
              name="stopCaseReasonText"
              value={this.state.stopCaseReasonText}
              onChange={this.handleChange}
              placeholder="Select Reason..."
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
              placeholder="Select Value..."
              value={this.state.sendsCorrespondence}
              name="sendsCorrespondence"
              onChange={this.handleChange}
              valid={this.validateItem("sendsCorrespondence").toString()}
            />
          </FormGroup>
        </FormRow>
        {this.state.sendsCorrespondence && (
          <FormRow>
            <FormGroup>
              <Label text="Email Template:" />
              <Dropdown
                fullWidth
                selection
                multiple
                options={this.state.emailTemplatesForDropdown}
                placeholder="Select Reason..."
                value={this.state.selectedEmailTemplates}
                name="selectedEmailTemplates"
                onChange={this.handleChange}
                valid={this.validateItem("selectedEmailTemplates").toString()}
              />
            </FormGroup>
          </FormRow>
        )}
        <FormRow>
          <FormGroup>
            <Label text="Updates Bluedog:" />
            <Dropdown
              fullWidth
              selection
              options={yesNo}
              placeholder="Select Value..."
              value={this.state.updatesBluedog}
              name="updatesBluedog"
              onChange={this.handleChange}
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
                placeholder="Select Watch List..."
                value={this.state.selectedBluedogWatchList}
                name="selectedBluedogWatchList"
                onChange={this.handleChange}
                valid={this.validateItem("selectedBluedogWatchList").toString()}
              />
            </FormGroup>
          </FormRow>
        )}
        <ButtonContainer justifyContent="space-between" marginTop="25">
          <Button
            content="Remove Reason"
            secondary
            onClick={() => this.setState({ removeModalOpen: true })}
            disabled={this.state.selectedStopCaseReasonId === ""}
          />
          <FlexBox>
            <Button content="Cancel" secondary onClick={this.clearForm} />
            <Button
              content="Update Reason"
              primary
              onClick={this.validateStopCaseReason}
            />
          </FlexBox>
        </ButtonContainer>
        <FlexBox justifyContent="flex-end">
          <Message
            show={this.state.showMessage}
            error={this.state.errorMessage}
            message={this.state.message}
            marginTop={15}
          />
        </FlexBox>

        <Modal
          isModalOpen={this.state.removeModalOpen}
          title="Remove Stop Case Reason"
          message="Are you sure you want to remove this reason?"
          item={
            this.state.selectedReason !== null
              ? this.state.selectedReason.text
              : ""
          }
        >
          <ButtonContainer justifyContent="flex-end">
            <Button
              content="Close"
              secondary
              onClick={() => this.setState({ removeModalOpen: false })}
            />
            <Button
              content="Remove"
              type="danger"
              onClick={() =>
                this.removeStopCaseReason(this.state.selectedStopCaseReasonId)
              }
            />
          </ButtonContainer>
        </Modal>
      </Card>
    );
  }
}

export default withErrorHandling(ManageStopCaseReasons);
