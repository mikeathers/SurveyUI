import React, { Component } from "react";
import { connect } from "react-redux";
import { loginUser } from "actions";

import {
  FormRow,
  FormGroup,
  Input,
  ButtonContainer,
  Button,
  Label
} from "components/Common";

import "./Login.scss";

class Login extends Component {
  render() {
    const user = {
      id: 1,
      name: "Michael Atherton",
      isAuthenticated: true
    };
    return (
      <div className="login">
        <div className="login__form">
          <h1>Mi3D Login</h1>
          <FormRow marginTop="30">
            <FormGroup>
              <Label text="Username:" />
              <Input />
            </FormGroup>
          </FormRow>
          <FormRow marginTop="15" marginBottom="30">
            <FormGroup>
              <Label text="Password:" />
              <Input />
              <Label
                text="Forgot Password"
                light
                button
                width="100"
                marginTop="5"
              />
            </FormGroup>
          </FormRow>
          <ButtonContainer>
            <Button
              content="Login"
              onClick={() => this.props.loginUser(user)}
              primary
            />
          </ButtonContainer>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  { loginUser }
)(Login);
