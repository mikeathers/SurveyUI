import React, { Component } from "react";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import { yesNo } from "helpers/dropdowns";

import {
  validateItem,
  validateItems,
  setItemToValidate,
  validateListOfStrings,
  removeValidationErrors
} from "helpers/validation";

import {
  Label,
  Button,
  FormRow,
  Dropdown,
  FormGroup,
  ButtonContainer
} from "components/Common";

import "./UpdateCallBackModal.scss";

export default class UpdateCallBackModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      callBackAnswered: "",
      rescheduleNeeded: "",
      startDate: new Date(),
      callBackSubmitted: false,
      moveRescheduledForward: false,
      buttonContent: "Complete Call Back"
    };

    this.validateItem = validateItem.bind(this);
    this.validateItems = validateItems.bind(this);
    this.setItemToValidate = setItemToValidate.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }

  handleChange = (e, { name, value }) => {
    if (name === "callBackAnswered" && value === false)
      this.setState({
        rescheduleNeeded: false,
        callBackAnswered: false,
        moveRescheduledForward: true,
        buttonContent: "Move Call Forward"
      });
    else this.setState({ buttonContent: "Complete Call Back" });

    if (name === "rescheduleNeeded" && value === true)
      this.setState({ buttonContent: "Reschedule Call" });
    else if (name === "rescheduleNeeded" && value === false)
      this.setState({ buttonContent: "Complete Call Back" });

    this.setItemToValidate(name);
    this.setState({ [name]: value });
  };

  handleDateChange = date => this.setState({ startDate: date });

  listToValidate = () => {
    return [
      { callBackAnswered: this.state.callBackAnswered },
      { rescheduleNeeded: this.state.rescheduleNeeded }
    ];
  };

  callback = () => ({
    createdBy: this.props.username,
    completedBy: this.props.username,
    caseId: this.props.mi3dCase.caseId,
    callBackId: this.props.callback.callBackId,
    actionedBy: this.props.username,
    callbackType: this.props.callback.callBackType
  });

  rescheduleCallBack = () => ({
    ...this.callback(),
    callbackType: "Reschedule",
    timeToCall: this.state.startDate
  });

  moveRescheduledCallBack = () => ({
    ...this.callback(),
    callbackType: "Reschedule",
    moveRescheduledForward: true,
    timeToCall: this.state.startDate
  });

  newInitialCallBack = () => ({
    ...this.callback(),
    timeToCall: this.state.startDate
  });

  updateCallBack = async () => {
    this.setState({ callBackSubmitted: true });
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      if (this.state.rescheduleNeeded)
        await this.props.rescheduleCallBack(this.rescheduleCallBack());
      else if (
        !this.state.callBackAnswered &&
        this.state.moveRescheduledForward
      )
        await this.props.rescheduleCallBack(this.moveRescheduledCallBack());
      else if (!this.state.callBackAnswered)
        await this.props.moveInitialCallBack(this.newInitialCallBack());
      else if (this.state.callBackAnswered && !this.state.rescheduleNeeded)
        await this.props.completeCallBack(this.callback());
    } else {
      this.validateItems(list);
      this.setState({ callBackSubmitted: false });
    }
    this.clearForm();
  };

  validateCallBack = () => {
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      if (this.state.rescheduleNeeded) {
      } else if (this.state.callBackAnswered === false)
        this.props.moveInitialCallBack(this.newInitialCallback());
      else if (
        this.state.callBackAnswered &&
        this.state.rescheduleNeeded === false
      )
        this.props.completeCallBack(this.callback());
    } else this.validateItems(list);
    this.clearForm();
  };

  clearForm = () => {
    this.setState({
      callBackAnswered: "",
      rescheduleNeeded: "",
      callBackSubmitted: false,
      buttonContent: "Complete Call Back"
    });
  };

  closeModal = () => {
    this.clearForm();
    this.props.closeModal();
    this.removeValidationErrors(this.listToValidate());
  };

  render() {
    const {
      callBackAnswered,
      rescheduleNeeded,
      startDate,
      buttonContent
    } = this.state;
    return (
      <Modal
        ariaHideApp={false}
        isOpen={this.props.isModalOpen}
        content="Update Call Back"
        className="update-callback-modal"
      >
        <div className="update-callback-modal__header">
          <h3>Update Call Back</h3>
        </div>
        <hr />
        <div className="update-callback-modal__body">
          <FormRow>
            <FormGroup flexBasis="45">
              <Label text="Did the injured party answer the call?" />
              <Dropdown
                options={yesNo}
                selection
                name="callBackAnswered"
                placeholder="Select..."
                valid={this.validateItem("callBackAnswered").toString()}
                onChange={this.handleChange}
              />
            </FormGroup>
            {callBackAnswered !== "" &&
              (callBackAnswered !== false ? (
                <FormGroup flexBasis="40">
                  <Label text="Do you need to reschedule the call?" />
                  <Dropdown
                    options={yesNo}
                    selection
                    name="rescheduleNeeded"
                    placeholder="Select..."
                    valid={this.validateItem("rescheduleNeeded").toString()}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              ) : null)}
          </FormRow>
          {rescheduleNeeded && (
            <FormRow>
              <FormGroup flexBasis="100">
                <Label text="Select a time to call back" />
                <DatePicker
                  selected={startDate}
                  onChange={this.handleDateChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy, h:mm aa"
                  timeCaption="time"
                />
              </FormGroup>
            </FormRow>
          )}
        </div>
        <hr />
        <div className="update-callback-modal__footer">
          <ButtonContainer justifyContent="space-between">
            <div>
              <Button
                type="danger"
                content="Remove"
                onClick={this.props.showRemoveModal}
                disabled={this.state.callBackSubmitted}
              />
            </div>
            <div>
              <Button
                secondary
                content="Close"
                onClick={this.closeModal}
                disabled={this.state.callBackSubmitted}
              />
              <Button
                primary
                content={buttonContent}
                onClick={this.updateCallBack}
                disabled={this.state.callBackSubmitted}
                loading={this.state.callBackSubmitted}
              />
            </div>
          </ButtonContainer>
        </div>
      </Modal>
    );
  }
}
