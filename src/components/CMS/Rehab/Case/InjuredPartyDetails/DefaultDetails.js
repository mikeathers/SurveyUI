import React, { Component } from "react";
import moment from "moment";
import {
  FormGroup,
  FormRow,
  Button,
  ButtonContainer,
  Label
} from "components/Common";
export default class DefaultDetails extends Component {
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
      age
    } = this.props.case;
    return (
      <div>
        <FormRow>
          <FormGroup inline>
            <Label text="First Name:" />
            <p>{firstName}</p>
          </FormGroup>
          <FormGroup inline>
            <Label text="Last Name:" />
            <p>{lastName}</p>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup inline>
            <Label text="House No:" />
            <p>{houseNo}</p>
          </FormGroup>
          <FormGroup inline>
            <Label text="Address 1:" />
            <p>{address1}</p>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup inline>
            <Label text="Address 2" />
            <p>{address2}</p>
          </FormGroup>
          <FormGroup inline>
            <Label text="Address 3:" />
            <p>{address3}</p>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup inline>
            <Label text="Address 4:" />
            <p>{address4}</p>
          </FormGroup>
          <FormGroup inline>
            <Label text="Postcode: " />
            <p>{postCode}</p>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup inline>
            <Label text="Email:" />
            <p>{email}</p>
          </FormGroup>
          <FormGroup inline>
            <Label text="Date of Birth:" />
            <p>{moment(dateOfBirth).format("DD/MM/YYYY")}</p>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup inline>
            <Label text="Age:" />
            <p>{age}</p>
          </FormGroup>
        </FormRow>

        <ButtonContainer justifyContent="flex-end">
          <Button content="Update" primary onClick={this.props.switchForms} />
        </ButtonContainer>
      </div>
    );
  }
}
