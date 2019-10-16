import React, { Component } from "react";
import DatePicker from "react-datepicker";

import {
  Label,
  Input,
  Button,
  FormRow,
  FormGroup,
  ButtonContainer
} from "components/Common";

import {
  validateItem,
  validateItems,
  setItemToValidate,
  validateListOfStrings,
  removeValidationErrors
} from "helpers/validation";

import "./InjuredPartyDetails.scss";

export default class UpdateDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updating: false,
      detailsSubmitted: false,
      email: props.case.email,
      title: props.case.title,
      houseNo: props.case.houseNo,
      address1: props.case.address1,
      address2: props.case.address2,
      address3: props.case.address3,
      address4: props.case.address4,
      postCode: props.case.postCode,
      lastName: props.case.lastName,
      firstName: props.case.firstName,
      bluedogCaseRef: props.case.bluedogCaseRef,
      dateOfBirth: new Date(props.case.dateOfBirth)
    };

    this.validateItem = validateItem.bind(this);
    this.validateItems = validateItems.bind(this);
    this.setItemToValidate = setItemToValidate.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }

  handleDateChange = date => this.setState({ dateOfBirth: date });

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.setState({ [name]: value });
  };

  listToValidate = () => {
    return [
      { title: this.state.title },
      { lastName: this.state.lastName },
      { address1: this.state.address1 },
      { address2: this.state.address2 },
      { address3: this.state.address3 },
      { postCode: this.state.postCode },
      { firstName: this.state.firstName },
      { dateOfBirth: this.state.dateOfBirth },
      { bluedogCaseRef: this.state.bluedogCaseRef }
    ];
  };

  updatedDetails = () => ({
    title: this.state.title,
    email: this.state.email,
    houseNo: this.state.houseNo,
    address1: this.state.address1,
    address2: this.state.address2,
    address3: this.state.address3,
    address4: this.state.address4,
    postCode: this.state.postCode,
    lastName: this.state.lastName,
    firstName: this.state.firstName,
    dateOfBirth: this.state.dateOfBirth,
    bluedogCaseRef: this.state.bluedogCaseRef
  });

  updateDetails = () => {
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      this.props.updateDetails(this.updatedDetails());
      this.setState({ detailsSubmitted: true });
    } else {
      this.validateItems(list);
      this.setState({ detailsSubmitted: false });
    }
  };

  cancel = () => {
    this.removeValidationErrors(this.listToValidate());
    this.props.switchForms();
  };

  render() {
    const {
      title,
      email,
      houseNo,
      address1,
      address2,
      address3,
      address4,
      postCode,
      lastName,
      firstName,
      dateOfBirth
    } = this.state;
    return (
      <div className="update-injured-party-details">
        <FormRow>
          <FormGroup inline flexBasis="30">
            <Label text="Title:" />
            <Input
              name="title"
              value={title}
              onChange={this.handleChange}
              valid={this.validateItem("title").toString()}
            />
          </FormGroup>
          <FormGroup inline flexBasis="30">
            <Label text="First Name:" />
            <Input
              name="firstName"
              value={firstName}
              onChange={this.handleChange}
              valid={this.validateItem("firstName").toString()}
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup inline flexBasis="30">
            <Label text="Last Name:" />
            <Input
              name="lastName"
              value={lastName}
              onChange={this.handleChange}
              valid={this.validateItem("lastName").toString()}
            />
          </FormGroup>
          <FormGroup inline flexBasis="30">
            <Label text="House No" />
            <Input
              name="houseNo"
              onChange={this.handleChange}
              value={houseNo != null ? houseNo : ""}
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup inline flexBasis="30">
            <Label text="Address 1" />
            <Input
              name="address1"
              value={address1}
              onChange={this.handleChange}
              valid={this.validateItem("address1").toString()}
            />
          </FormGroup>
          <FormGroup inline flexBasis="30">
            <Label text="Address 2" />
            <Input
              name="address2"
              value={address2}
              onChange={this.handleChange}
              valid={this.validateItem("address2").toString()}
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup inline flexBasis="30">
            <Label text="Address 3" />
            <Input
              name="address3"
              value={address3}
              onChange={this.handleChange}
              valid={this.validateItem("address3").toString()}
            />
          </FormGroup>
          <FormGroup inline flexBasis="30">
            <Label text="Address 4" />
            <Input
              name="address4"
              onChange={this.handleChange}
              value={address4 != null ? address4 : ""}
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup inline flexBasis="30">
            <Label text="Postcode" />
            <Input
              name="postCode"
              value={postCode}
              onChange={this.handleChange}
              valid={this.validateItem("postCode").toString()}
            />
          </FormGroup>
          <FormGroup inline flexBasis="30">
            <Label text="Email" />
            <Input
              name="email"
              onChange={this.handleChange}
              value={email != null ? email : ""}
            />
          </FormGroup>
          <FormGroup inline flexBasis="30">
            <Label text="Date of Birth" />
            <DatePicker
              timeIntervals={15}
              timeCaption="time"
              selected={dateOfBirth}
              dateFormat="dd/MM/yyyy"
              onChange={this.handleDateChange}
            />
          </FormGroup>
        </FormRow>
        <ButtonContainer marginTop={40} justifyContent="flex-end">
          <Button
            secondary
            content="Cancel"
            onClick={this.cancel}
            disabled={this.state.detailsSubmitted}
          />
          <Button
            primary
            content="Save"
            onClick={this.updateDetails}
            disabled={this.state.detailsSubmitted}
            loading={this.state.detailsSubmitted}
          />
        </ButtonContainer>
      </div>
    );
  }
}
