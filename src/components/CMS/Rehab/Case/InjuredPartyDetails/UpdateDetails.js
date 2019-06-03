import React, { Component } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import {
  FormGroup,
  FormRow,
  Button,
  ButtonContainer,
  Input,
  Label
} from "components/Common";

import {
  validateListOfStrings,
  validateItems,
  removeValidationErrors,
  validateItem,
  setItemToValidate
} from "helpers/validation";

import "./InjuredPartyDetails.scss";

export default class UpdateDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updating: false,
      bluedogCaseRef: props.case.bluedogCaseRef,
      firstName: props.case.firstName,
      lastName: props.case.lastName,
      email: props.case.email,
      address1: props.case.address1,
      address2: props.case.address2,
      address3: props.case.address3,
      address4: props.case.address4,
      houseNo: props.case.houseNo,
      postCode: props.case.postCode,
      dateOfBirth: new Date(props.case.dateOfBirth)
    };

    this.setItemToValidate = setItemToValidate.bind(this);
    this.validateItems = validateItems.bind(this);
    this.validateItem = validateItem.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.setState({ [name]: value });
  };

  listToValidate = () => {
    return [
      { bluedogCaseRef: this.state.bluedogCaseRef },
      { firstName: this.state.firstName },
      { lastName: this.state.lastName },
      { dateOfBirth: this.state.dateOfBirth },
      { address1: this.state.address1 },
      { address2: this.state.address2 },
      { address3: this.state.address3 },
      { postCode: this.state.postCode }
    ];
  };

  updateDetails = () => {
    const updatedDetails = {
      bluedogCaseRef: this.state.bluedogCaseRef,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      dateOfBirth: this.state.dateOfBirth,
      address1: this.state.address1,
      address2: this.state.address2,
      address3: this.state.address3,
      address4: this.state.address4,
      houseNo: this.state.houseNo,
      postCode: this.state.postCode
    };

    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      this.props.updateDetails(updatedDetails);
    } else {
      this.validateItems(list);
    }
  };

  cancel = () => {
    this.removeValidationErrors(this.listToValidate());
    this.props.switchForms();
  };

  handleDateChange = date => this.setState({ dateOfBirth: date });

  render() {
    const {
      firstName,
      lastName,
      email,
      address1,
      address2,
      address3,
      address4,
      houseNo,
      postCode,
      dateOfBirth
    } = this.state;
    return (
      <div className="update-injured-party-details">
        <FormRow>
          <FormGroup inline>
            <Label text="First Name:" />
            <Input
              value={firstName}
              name="firstName"
              onChange={this.handleChange}
              valid={this.validateItem("firstName").toString()}
            />
          </FormGroup>
          <FormGroup inline>
            <Label text="Last Name:" />
            <Input
              value={lastName}
              name="lastName"
              onChange={this.handleChange}
              valid={this.validateItem("lastName").toString()}
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup inline>
            <Label text="House No" />
            <Input
              value={houseNo}
              name="houseNo"
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup inline>
            <Label text="Address 1" />
            <Input
              value={address1}
              name="address1"
              onChange={this.handleChange}
              valid={this.validateItem("address1").toString()}
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup inline>
            <Label text="Address 2" />
            <Input
              value={address2}
              name="address2"
              onChange={this.handleChange}
              valid={this.validateItem("address2").toString()}
            />
          </FormGroup>
          <FormGroup inline>
            <Label text="Address 3" />
            <Input
              value={address3}
              name="address3"
              onChange={this.handleChange}
              valid={this.validateItem("address3").toString()}
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup inline>
            <Label text="Address 4" />
            <Input
              value={address4}
              name="address4"
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup inline>
            <Label text="Postcode" />
            <Input
              value={postCode}
              name="postCode"
              onChange={this.handleChange}
              valid={this.validateItem("postCode").toString()}
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup inline>
            <Label text="Email" />
            <Input value={email} name="email" onChange={this.handleChange} />
          </FormGroup>
          <FormGroup inline>
            <Label text="Date of Birth" />
            {/* <Input
              value={moment(dateOfBirth).format("DD/MM/YYYY")}
              name="dateOfBirth"
              onChange={this.handleChange}
              valid={this.validateItem("dateOfBirth").toString()}
            /> */}
            <DatePicker
              selected={dateOfBirth}
              onChange={this.handleDateChange}
              timeIntervals={15}
              dateFormat="dd/MM/yyyy"
              timeCaption="time"
            />
          </FormGroup>
        </FormRow>
        <ButtonContainer marginTop={40} justifyContent="flex-end">
          <Button content="Cancel" secondary onClick={this.cancel} />
          <Button content="Save" primary onClick={this.updateDetails} />
        </ButtonContainer>
      </div>
    );
  }
}
