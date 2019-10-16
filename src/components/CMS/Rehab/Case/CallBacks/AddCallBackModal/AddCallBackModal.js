import React, { Component } from "react";
import { callbackTypes } from "helpers/dropdowns";
import * as api from "api";
import {withErrorHandling} from "HOCs";
import Modal from "react-modal";
import DatePicker from "react-datepicker";

import {
  validateListOfStrings,
  validateItems,
  removeValidationErrors,
  validateItem,
  setItemToValidate
} from "helpers/validation";

import {
  ButtonContainer,
  Button,
  Dropdown,
  FormRow,
  FormGroup,
  Message,
  Label
} from "components/Common";

import "react-datepicker/dist/react-datepicker.css";
import "./AddCallBackModal.scss";

class AddCallBackModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      rescheduleSelected: false,
      callbackType: "",
      callbackSubmitted: false
    };

    this.setItemToValidate = setItemToValidate.bind(this);
    this.validateItems = validateItems.bind(this);
    this.validateItem = validateItem.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }

  handleDateChange = date => this.setState({ startDate: date });

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.setState({ [name]: value, rescheduleSelected: false }, () => {
      this.handleRescheduleSelected();
    });
  };

  handleRescheduleSelected = () => {
    if (this.state.callbackType === "Reschedule")
      this.setState({ rescheduleSelected: true });
  };

  listToValidate = () => {
    return [{ callbackType: this.state.callbackType }];
  };

  callback = () => ({
    createdBy: this.props.username,
    callbackType: this.state.callbackType,
    caseId: this.props.mi3dCase.caseId,
    bluedogCaseRef: this.props.mi3dCase.bluedogCaseRef,
    actionedBy: this.props.username
  });

  rescheduledCallback = () => ({
    ...this.callback(),
    timeToCall: this.state.startDate
  });

  validateAddCallback = () => {
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      if (this.state.callbackType === "Reschedule")
        this.addCallback(this.rescheduledCallback());
      else this.addCallback(this.callback());
    } else this.validateItems(list);
  };

  showSuccessMessage = message => {
    this.setState({
      message,
      errorMessage: false,
      showMessage: true
    });
  };

  showErrorMessage = message => {
    this.setState({
      showMessage: true,
      errorMessage: true,
      message,
      callbackSubmitted: false
    });
  };

  addCallback = async callback => {
    this.setState({ callbackSubmitted: true });
    await this.props.addCallback(callback);
    this.setState({ callbackSubmitted: false });
  };

  closeModal = () => {
    this.removeValidationErrors(this.listToValidate());
    this.setState({
      callbackType: "",
      rescheduleSelected: false,
      callbackSubmitted: false
    });
    this.props.closeModal();
  };

  render() {
    const { rescheduleSelected, startDate } = this.state;
    return (
      <Modal
        ariaHideApp={false}
        isOpen={this.props.isModalOpen}
        contentLabel="Add Call Back"
        className="add-callback-modal"
        id="addCallBackModal"
      >
        <div className="add-callback-modal__header">
          <h3>Add a Call Back</h3>
        </div>
        <hr />
        <div className="add-callback-modal__body">
          <FormRow>
            <FormGroup flexBasis="30">
              <Label text="Call Back Type:" />
              <Dropdown
                selection
                name="callbackType"
                options={callbackTypes}
                placeholder="Select Type.."
                onChange={this.handleChange}
                valid={this.validateItem("callbackType").toString()}
                id="callback-type-dropdown"
                value={this.state.callbackType}
              />
            </FormGroup>
            {rescheduleSelected && (
              <FormGroup flexBasis="30">
                <Label text="Call Back Time:" />
                <DatePicker
                  selected={startDate}
                  onChange={this.handleDateChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy, h:mm aa"
                  timeCaption="time"
                  id="callback-date-picker"
                />
              </FormGroup>
            )}
          </FormRow>
        </div>
        <hr />
        <div className="add-callback-modal__footer">
          <ButtonContainer justifyContent="flex-end" marginTop={15}>
            <Message
              show={this.props.show}
              error={this.props.message !== ""}
              message={this.props.message}
              marginRight={45}
              id="callback-submitted-message"
            />
            <Button
              id="close-callback-modal-button"
              content="Close"
              secondary
              onClick={this.closeModal}
              disabled={this.state.callbackSubmitted}
            />
            <Button
              id="add-callback-button"
              content="Add"
              primary
              onClick={this.validateAddCallback}
              disabled={this.state.callbackSubmitted}
              loading={this.state.callbackSubmitted}
            />
          </ButtonContainer>
        </div>
      </Modal>
    );
  }
}

export default withErrorHandling(AddCallBackModal);
