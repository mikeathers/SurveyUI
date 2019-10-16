import React, { Component } from "react";
import Modal from "react-modal";
import { telephoneTypes, preferredOptions } from "helpers/dropdowns";

import {
  validateItems,
  validateItem,
  setItemToValidate,
  validateListOfStrings,
  removeValidationErrors
} from "helpers/validation";

import {
  Form,
  Input,
  Button,
  FormRow,
  Dropdown,
  TextArea,
  FormGroup,
  ButtonContainer
} from "components/Common";

import "./ContactNumberModal.scss";

class ContactNumberModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: "",
      preferred: "",
      contactNumber: "",
      contactNumberId: "",
      contactNumberType: ""
    };
    this.validateItem = validateItem.bind(this);
    this.validateItems = validateItems.bind(this);
    this.setItemToValidate = setItemToValidate.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.telephoneInfo !== undefined) {
      if (props.telephoneInfo.contactNumberId !== undefined && !props.addNew)
        this.setContactNumber(props.telephoneInfo);
      else this.clearContactNumber();
    }
  }

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.setState({ [name]: value });
  };

  listToValidate = () => {
    return [
      { preferred: this.state.preferred },
      { contactNumber: this.state.contactNumber },
      { contactNumberType: this.state.contactNumberType }
    ];
  };

  setContactNumber = telephoneInfo => {
    this.setState({
      notes: telephoneInfo.notes,
      preferred: telephoneInfo.preferred,
      contactNumber: telephoneInfo.contactNumber,
      contactNumberId: telephoneInfo.contactNumberId,
      contactNumberType: telephoneInfo.contactNumberType
    });
  };

  clearContactNumber = () => {
    this.setState({
      notes: "",
      preferred: "",
      contactNumber: "",
      contactNumberId: "",
      contactNumberType: ""
    });
  };

  contactDetails = () => ({
    notes: this.state.notes,
    partyId: this.props.partyId,
    preferred: this.state.preferred,
    contactNumber: this.state.contactNumber,
    bluedogCaseRef: this.props.bluedogCaseRef,
    contactNumberId: this.state.contactNumberId,
    contactNumberType: this.state.contactNumberType
  });

  saveNumber = () => {
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      if (this.props.addNew) this.props.saveNumber(this.contactDetails());
      else this.props.updateNumber(this.contactDetails());
    } else this.validateItems(list);
  };

  closeModal = () => {
    this.removeValidationErrors(this.listToValidate());
    this.setState({
      notes: "",
      preferred: "",
      contactNumber: "",
      contactNumberId: "",
      contactNumberType: ""
    });
    this.props.closeModal();
  };

  render() {
    const { contactNumberType, preferred, notes } = this.state;
    return (
      <Modal
        ariaHideApp={false}
        isOpen={this.props.isModalOpen}
        contentLabel="Contact Number"
        className="contact-modal"
      >
        <div className="contact-modal__title">
          <h3>Injured Party Contact Details</h3>
        </div>
        <hr />
        <div className="contact-modal__body">
          <FormRow>
            <FormGroup flexBasis="20">
              <p>Type:</p>
              <Dropdown
                options={telephoneTypes}
                selection
                value={contactNumberType}
                onChange={this.handleChange}
                name="contactNumberType"
                valid={this.validateItem("contactNumberType").toString()}
              />
            </FormGroup>
            <FormGroup flexBasis="20">
              <p>Preferred:</p>
              <Dropdown
                options={preferredOptions}
                selection
                value={preferred}
                onChange={this.handleChange}
                name="preferred"
                valid={this.validateItem("preferred").toString()}
              />
            </FormGroup>
            <FormGroup flexBasis="20">
              <p>Number:</p>
              <Input
                value={this.state.contactNumber}
                name="contactNumber"
                onChange={this.handleChange}
                valid={this.validateItem("contactNumber").toString()}
                type="number"
              />
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup flexBasis="100">
              <p>Notes:</p>
              <Form>
                <TextArea
                  value={notes}
                  name="notes"
                  onChange={this.handleChange}
                />
              </Form>
            </FormGroup>
          </FormRow>
        </div>
        <hr />
        <div className="contact-modal__footer">
          <ButtonContainer
            justifyContent={this.props.addNew ? "flex-end" : "space-between"}
            marginTop={15}
          >
            {!this.props.addNew && (
              <Button
                content="Remove"
                type="danger"
                onClick={this.props.showRemoveModal}
              />
            )}
            <div>
              <Button content="Close" secondary onClick={this.closeModal} />
              <Button
                content={this.props.addNew ? "Add" : "Update"}
                primary
                onClick={this.saveNumber}
              />
            </div>
          </ButtonContainer>
        </div>
      </Modal>
    );
  }
}

export default ContactNumberModal;
