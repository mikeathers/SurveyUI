import React, { Component } from "react";
import Modal from "react-modal";
import { telephoneTypes, preferredOptions } from "helpers/dropdowns";

import {
  validateListOfStrings,
  validateItems,
  removeValidationErrors,
  validateItem,
  setItemToValidate
} from "helpers/validation";

import {
  Button,
  ButtonContainer,
  Input,
  FormGroup,
  FormRow,
  Form,
  Dropdown,
  TextArea
} from "components/Common";

import "./ContactNumberModal.scss";

// Modal.setAppElement("#root");

class ContactNumberModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactNumberId: "",
      contactNumberType: "",
      contactNumber: "",
      preferred: "",
      notes: ""
    };
    this.setItemToValidate = setItemToValidate.bind(this);
    this.validateItems = validateItems.bind(this);
    this.validateItem = validateItem.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.telephoneInfo !== undefined) {
      if (props.telephoneInfo.contactNumberId !== undefined && !props.addNew) {
        this.setState({
          contactNumberId: props.telephoneInfo.contactNumberId,
          contactNumberType: props.telephoneInfo.contactNumberType,
          contactNumber: props.telephoneInfo.contactNumber,
          preferred: props.telephoneInfo.preferred,
          notes: props.telephoneInfo.notes
        });
      } else {
        this.setState({
          contactNumberId: "",
          contactNumberType: "",
          contactNumber: "",
          preferred: "",
          notes: ""
        });
      }
    }
  }

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.setState({ [name]: value });
  };

  listToValidate = () => {
    return [
      { contactNumber: this.state.contactNumber },
      { contactNumberType: this.state.contactNumberType },
      { preferred: this.state.preferred }
    ];
  };

  saveNumber = () => {
    const details = {
      contactNumberId: this.state.contactNumberId,
      contactNumberType: this.state.contactNumberType,
      contactNumber: this.state.contactNumber,
      preferred: this.state.preferred,
      notes: this.state.notes,
      bluedogCaseRef: this.props.bluedogCaseRef,
      partyId: this.props.partyId
    };
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      if (this.props.addNew) this.props.saveNumber(details);
      else this.props.updateNumber(details);
    } else {
      this.validateItems(list);
    }
  };

  closeModal = () => {
    this.removeValidationErrors(this.listToValidate());
    this.setState({
      contactNumberId: "",
      contactNumberType: "",
      contactNumber: "",
      preferred: "",
      notes: ""
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
          <ButtonContainer justifyContent="flex-end" marginTop={15}>
            <Button content="Close" secondary onClick={this.closeModal} />
            <Button
              content={this.props.addNew ? "Add" : "Update"}
              primary
              onClick={this.saveNumber}
            />
          </ButtonContainer>
        </div>
      </Modal>
    );
  }
}

export default ContactNumberModal;
