import React, { Component } from "react";
import { callbackTypes } from "helpers/dropdowns";

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

export default class AddCallBackModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      rescheduleSelected: false,
      callbackType: ""
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
      if (this.state.callbackType === "Reschedule")
        this.setState({ rescheduleSelected: true });
    });
  };

  listToValidate = () => {
    return [{ callbackType: this.state.callbackType }];
  };

  addCallback = () => {
    var list = validateListOfStrings(this.listToValidate());
    const callbackType = this.state.callbackType;

    if (list[list.length - 1].isValid) {
      const callback = {
        createdBy: this.props.user.name,
        callbackType,
        caseId: this.props.mi3dCase.caseId,
        bluedogCaseRef: this.props.mi3dCase.bluedogCaseRef,
        actionedBy: this.props.user.name
      };
      if (callbackType === "Reschedule") {
        const rescheduledCallback = {
          ...callback,
          timeToCall: this.state.startDate
        };
        this.props.addCallback(rescheduledCallback);
      } else this.props.addCallback(callback);
      this.closeModal();
    } else {
      this.validateItems(list);
    }
  };

  closeModal = () => {
    this.removeValidationErrors(this.listToValidate());
    this.setState({ rescheduleSelected: false, callbackType: "" });
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
              />
            </FormGroup>
            {rescheduleSelected && (
              <FormGroup>
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
            />
            <Button
              id="add-callback-button"
              content="Add"
              primary
              onClick={this.addCallback}
            />
          </ButtonContainer>
        </div>
      </Modal>
    );
  }
}
