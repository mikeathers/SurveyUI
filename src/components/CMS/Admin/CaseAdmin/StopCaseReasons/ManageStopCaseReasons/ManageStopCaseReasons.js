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
export default class ManageStopCaseReasons extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      selectedStopCaseReasonId: "",
      selectedStopCaseReasonType: "",
      stopCaseReasonText: "",
      selectedEmailTemplateId: "",
      stopCaseReasons: [],
      stopCaseReasonsForDropdown: [],
      emailTemplatesForDropdown: [],
      selectedReason: null,
      showMessage: false,
      message: "",
      removeModalOpen: false
    };
    this.setItemToValidate = setItemToValidate.bind(this);
    this.validateItems = validateItems.bind(this);
    this.validateItem = validateItem.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    api.getStopCaseReasons().then(res => {
      if (this._isMounted) {
        if (res.status === 200) {
          this.setState({ stopCaseReasons: res.data });
          this.stopCaseReasonsForDropdown(res.data);
        }
      }
    });
    api.getEmailTemplates().then(res => {
      if (this._isMounted) {
        this.setState({ emailTemplates: res.data }, () =>
          this.emailTemplatesForDropdown(res.data)
        );
      }
    });
  }

  componentWillReceiveProps() {
    api.getStopCaseReasons().then(res => {
      if (res.status === 200) {
        if (this._isMounted) {
          this.setState({ stopCaseReasons: res.data });
          this.stopCaseReasonsForDropdown(res.data);
        }
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
      { selectedStopCaseReasonId: this.state.selectedStopCaseReasonId },
      { selectedStopCaseReasonType: this.state.selectedStopCaseReasonType },
      { stopCaseReasonText: this.state.stopCaseReasonText },
      { selectedEmailTemplateId: this.state.selectedEmailTemplateId }
    ];
  };

  stopCaseReasonsForDropdown = reasons => {
    const stopCaseReasonsForDropdown = reasons.map((reason, key) => ({
      text: reason.text,
      value: reason.stopCaseReasonId,
      key
    }));
    this.setState({ stopCaseReasonsForDropdown });
  };

  emailTemplatesForDropdown = templates => {
    const emailTemplatesForDropdown = templates.map((template, key) => ({
      text: template.name,
      value: template.emailTemplateId,
      key
    }));
    this.setState({ emailTemplatesForDropdown });
  };

  handleReasonChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.setItemToValidate("stopCaseReasonText");
    this.setItemToValidate("selectedStopCaseReasonType");
    this.setItemToValidate("selectedEmailTemplateId");
    const selectedReason = this.state.stopCaseReasons.find(
      m => m.stopCaseReasonId === value
    );
    this.setState({
      [name]: value,
      selectedReason,
      stopCaseReasonText: selectedReason.text,
      selectedStopCaseReasonType: selectedReason.type,
      selectedEmailTemplateId: selectedReason.emailTemplate.emailTemplateId
    });
  };

  updateStopCaseReason = reason => {
    api.saveStopCaseReason(reason).then(res => {
      if (this._isMounted) {
        if (res.status === 200) {
          this.setState({ showMessage: true });
          setTimeout(() => this.setState({ showMessage: false }), 3000);
          this.setState({ stopCaseReasons: res.data });
          this.stopCaseReasonsForDropdown(res.data);
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
      emailTemplateId: this.state.selectedEmailTemplateId,
      stopCaseReasonId:
        this.state.selectedReason !== null
          ? this.state.selectedReason.stopCaseReasonId
          : 0
    };

    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      this.updateStopCaseReason(reason);
    } else {
      this.validateItems(list);
    }
  };

  removeStopCaseReason = stopCaseReasonId => {
    api.removeStopCaseReason(stopCaseReasonId).then(res => {
      if (this._isMounted) {
        if (res.status === 200) {
          this.setState({
            showMessage: true,
            removeModalOpen: false,
            stopCaseReasonText: "",
            selectedStopCaseReasonType: "",
            selectedEmailTemplateId: "",
            selectedStopCaseReasonId: ""
          });
          setTimeout(() => this.setState({ showMessage: false }), 3000);
          this.setState({ stopCaseReasons: res.data });
          this.stopCaseReasonsForDropdown(res.data);
        }
      }
    });
  };

  validateRemoveStopCaseReason = stopCaseReasonId => {
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      this.removeStopCaseReason(stopCaseReasonId);
    } else {
      this.setState({ removeModalOpen: false });
      this.validateItems(list);
    }
  };

  clearForm = () => {
    this.setState({
      selectedStopCaseReasonId: "",
      selectedStopCaseReasonType: "",
      stopCaseReasonText: "",
      selectedEmailTemplateId: ""
    });
  };

  render() {
    return (
      <Card title="Manage Stop Case Reasons">
        <FormRow>
          <FormGroup>
            <Label text="Stop Case Reason:" width="100" />
            <Dropdown
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
            <Label text="Reason Text:" width="100" />
            <Input
              name="stopCaseReasonText"
              value={this.state.stopCaseReasonText}
              onChange={this.handleChange}
              placeholder="Select Reason..."
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
              placeholder="Select Type..."
              onChange={this.handleChange}
              width="100"
              valid={this.validateItem("selectedStopCaseReasonType").toString()}
            />
          </FormGroup>
        </FormRow>
        <ButtonContainer justifyContent="space-between" marginTop="25">
          <Button
            content="Remove Reason"
            secondary
            onClick={() => this.setState({ removeModalOpen: true })}
          />
          <FlexBox>
            <Message
              show={this.state.showMessage}
              error={this.state.message !== ""}
              message={this.state.message}
              marginRight={45}
            />
            <Button content="Cancel" secondary onClick={this.clearForm} />
            <Button
              content="Update Reason"
              primary
              onClick={this.validateStopCaseReason}
            />
          </FlexBox>
        </ButtonContainer>
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
                this.validateRemoveStopCaseReason(
                  this.state.selectedStopCaseReasonId
                )
              }
            />
          </ButtonContainer>
        </Modal>
      </Card>
    );
  }
}
