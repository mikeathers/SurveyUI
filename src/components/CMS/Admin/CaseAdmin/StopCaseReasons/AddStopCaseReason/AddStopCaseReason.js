import React, { Component } from "react";
import * as api from "api";
import { stopCaseReasonTypes } from "helpers/dropdowns";

import {
  validateListOfStrings,
  validateItems,
  removeValidationErrors,
  validateItem,
  setItemToValidate
} from "helpers/validation";

import {
  Card,
  FormRow,
  FormGroup,
  Label,
  Input,
  Dropdown,
  Button,
  ButtonContainer,
  Message
} from "components/Common";

import "./AddStopCaseReason.scss";

export default class AddStopCaseReason extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      emailTemplates: [],
      emailTemplatesForDropdown: [],
      selectedEmailTemplateId: "",
      stopCaseReasonText: "",
      selectedStopCaseReasonType: "",
      showMessage: false,
      message: ""
    };

    this.setItemToValidate = setItemToValidate.bind(this);
    this.validateItems = validateItems.bind(this);
    this.validateItem = validateItem.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    api.getEmailTemplates().then(res => {
      if (this._isMounted) {
        this.setState({ emailTemplates: res.result }, () =>
          this.emailTemplatesForDropdown(res.result)
        );
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.setState({ [name]: value });
  };

  listToValidate = () => {
    return [
      { selectedEmailTemplateId: this.state.selectedEmailTemplateId },
      { stopCaseReasonText: this.state.stopCaseReasonText },
      { selectedStopCaseReasonType: this.state.selectedStopCaseReasonType }
    ];
  };

  emailTemplatesForDropdown = templates => {
    const emailTemplatesForDropdown = templates.map((template, key) => ({
      text: template.name,
      value: template.emailTemplateId,
      key
    }));
    this.setState({ emailTemplatesForDropdown });
  };

  addStopCaseReason = reason => {
    api.saveStopCaseReason(reason).then(res => {
      if (this._isMounted) {
        if (!res.data.hasErrors) {
          this.setState({
            showMessage: true,
            selectedEmailTemplateId: "",
            selectedStopCaseReasonType: "",
            stopCaseReasonText: ""
          });
          setTimeout(() => this.setState({ showMessage: false }), 3000);
          this.props.stopCaseReasonsAdded();
        } else {
          this.setState({
            showMessage: true,
            message: res.data.errors[0].message
          });
          setTimeout(() => this.setState({ showMessage: false }), 3000);
        }
      }
    });
  };

  validateStopCaseReason = () => {
    const reason = {
      text: this.state.stopCaseReasonText,
      type: this.state.selectedStopCaseReasonType,
      emailTemplateId: this.state.selectedEmailTemplateId
    };

    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      this.addStopCaseReason(reason);
    } else {
      this.validateItems(list);
    }
  };

  clearForm = () => {
    this.setState({
      selectedEmailTemplateId: "",
      stopCaseReasonText: "",
      selectedStopCaseReasonType: ""
    });
  };

  render() {
    return (
      <Card title="Add Stop Case Reason">
        <FormRow>
          <FormGroup>
            <Label text="Stop Case Reason:" width="100" />
            <Input
              placeholder="Claimant doesnt want to proceed"
              value={this.state.stopCaseReasonText}
              name="stopCaseReasonText"
              onChange={this.handleChange}
              valid={this.validateItem("stopCaseReasonText").toString()}
            />
          </FormGroup>
          <FormGroup>
            <Label text="Email Template:" width="100" />
            <Dropdown
              selection
              options={this.state.emailTemplatesForDropdown}
              placeholder="Select Reason..."
              value={this.state.selectedEmailTemplateId}
              name="selectedEmailTemplateId"
              onChange={this.handleChange}
              valid={this.validateItem("selectedEmailTemplateId").toString()}
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup>
            <Label text="Type:" width="100" />
            <Dropdown
              selection
              options={stopCaseReasonTypes}
              value={this.state.selectedStopCaseReasonType}
              name="selectedStopCaseReasonType"
              placeholder="Select Type.."
              onChange={this.handleChange}
              width="100"
              valid={this.validateItem("selectedStopCaseReasonType").toString()}
            />
          </FormGroup>
        </FormRow>
        <ButtonContainer justifyContent="flex-end" marginTop="15">
          <Message
            show={this.state.showMessage}
            error={this.state.message !== ""}
            message={this.state.message}
            marginRight={45}
          />
          <Button content="Cancel" secondary onClick={this.clearForm} />
          <Button
            content="Add Reason"
            primary
            onClick={this.validateStopCaseReason}
          />
        </ButtonContainer>
      </Card>
    );
  }
}
