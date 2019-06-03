import React, { Component } from "react";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import { yesNo } from "helpers/dropdowns";

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
  Label
} from "components/Common";

import "./UpdateCallBackModal.scss";

export default class UpdateCallBackModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      callBackAnswered: "",
      rescheduleNeeded: "",
      startDate: new Date(),
      buttonContent: "Complete Call Back"
    };

    this.validateItems = validateItems.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
    this.validateItem = validateItem.bind(this);
    this.setItemToValidate = setItemToValidate.bind(this);
  }

  handleChange = (e, { name, value }) => {
    var modal = document.querySelector(".update-callback-modal");

    if (name === "callBackAnswered" && value === false) {
      this.setState({
        rescheduleNeeded: false,
        callBackAnswered: false,
        buttonContent: "Move Call Forward"
      });
      modal.style.height = "240px";
    } else this.setState({ buttonContent: "Complete Call Back" });

    if (name === "rescheduleNeeded" && value === true) {
      modal.style.height = "320px";
      this.setState({ buttonContent: "Reschedule Call" });
    } else if (name === "rescheduleNeeded" && value === false) {
      modal.style.height = "240px";
      this.setState({ buttonContent: "Complete Call Back" });
    }

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

  resetState = () => {
    this.setState({
      callBackAnswered: "",
      rescheduleNeeded: "",
      buttonContent: "Complete Call Back"
    });
  };

  closeModal = () => {
    this.resetState();
    this.props.closeModal();
    this.removeValidationErrors(this.listToValidate());
    var modal = document.querySelector(".update-callback-modal");
    modal.style.height = "240px";
  };

  callback = () => {
    const callbackType = this.props.callback.callBackType;
    return {
      createdBy: this.props.user.name,
      completedBy: this.props.user.name,
      caseId: this.props.mi3dCase.caseId,
      callBackId: this.props.callback.callBackId,
      actionedBy: this.props.user.name,
      callbackType
    };
  };

  updateCallBack = () => {
    var list = validateListOfStrings(this.listToValidate());

    if (list[list.length - 1].isValid) {
      if (this.state.rescheduleNeeded) {
        const rescheduledCallback = {
          ...this.callback(),
          callbackType: "Reschedule",
          timeToCall: this.state.startDate
        };
        this.props.rescheduleCallBack(rescheduledCallback);
        this.resetState();
      } else if (this.state.callBackAnswered === false) {
        const newInitialCallback = {
          ...this.callback(),
          timeToCall: this.state.startDate
        };
        this.props.moveInitialCallBack(newInitialCallback);
        this.resetState();
      } else if (
        this.state.callBackAnswered &&
        this.state.rescheduleNeeded === false
      ) {
        this.props.completeCallBack(this.callback());
        this.resetState();
      }
    } else this.validateItems(list);
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
            <FormGroup flexBasis="40">
              <Label
                text="Did the injured party answer the call?"
                width="100"
              />
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
                  <Label
                    text="Do you need to reschedule the call?"
                    width="100"
                  />
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
                <Label text="Select a time to call back" width="100" />
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
                content="Remove"
                type="danger"
                onClick={this.props.showRemoveModal}
              />
            </div>
            <div>
              <Button content="Close" secondary onClick={this.closeModal} />
              <Button
                content={buttonContent}
                primary
                onClick={this.updateCallBack}
              />
            </div>
          </ButtonContainer>
        </div>
      </Modal>
    );
  }
}
