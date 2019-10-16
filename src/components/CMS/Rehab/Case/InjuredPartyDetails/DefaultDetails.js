import React, { Component } from "react";
import moment from "moment";
import {
  Label,
  Button,
  FormRow,
  FormGroup,
  ButtonContainer
} from "components/Common";

export default class DefaultDetails extends Component {
  calculateAge = dateOfBirth => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const m = today.getMonth() - birthDate.getMonth();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  render() {
    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      address1,
      address2,
      address3,
      address4,
      houseNo,
      postCode,
      title
    } = this.props.case;

    const age = this.calculateAge(dateOfBirth);
    return (
      <div>
        <FormRow>
          <FormGroup flexBasis="46" inline>
            <Label width="100" text="Title:" />
            <p>{title}</p>
          </FormGroup>
          <FormGroup flexBasis="46" inline>
            <Label width="100" text="First Name:" />
            <p>{firstName}</p>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup flexBasis="46" inline>
            <Label width="100" text="Last Name:" />
            <p>{lastName}</p>
          </FormGroup>
          <FormGroup flexBasis="46" inline>
            <Label width="100" text="House No:" />
            <p>{houseNo}</p>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup flexBasis="46" inline>
            <Label width="100" text="Address 1:" />
            <p>{address1}</p>
          </FormGroup>
          <FormGroup flexBasis="46" inline>
            <Label width="100" text="Address 2" />
            <p>{address2}</p>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup flexBasis="46" inline>
            <Label width="100" text="Address 3:" />
            <p>{address3}</p>
          </FormGroup>
          <FormGroup flexBasis="46" inline>
            <Label width="100" text="Address 4:" />
            <p>{address4}</p>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup flexBasis="46" inline>
            <Label width="100" text="Postcode: " />
            <p>{postCode}</p>
          </FormGroup>
          <FormGroup flexBasis="46" inline>
            <Label width="100" text="Email:" />
            <p>{email}</p>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup flexBasis="46" inline>
            <Label width="100" text="Date of Birth:" />
            <p>{moment(dateOfBirth).format("DD/MM/YYYY")}</p>
          </FormGroup>
          <FormGroup flexBasis="46" inline>
            <Label width="100" text="Age:" />
            <p>{age.toString()}</p>
          </FormGroup>
        </FormRow>

        <ButtonContainer justifyContent="flex-end">
          <Button content="Update" primary onClick={this.props.switchForms} />
        </ButtonContainer>
      </div>
    );
  }
}
