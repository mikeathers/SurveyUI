import React, { Component } from "react";

import FollowUpOne from "./FollowUpOne/FollowUpOne";
import FollowUpTwo from "./FollowUpTwo/FollowUpTwo";
import { Card, Button, ButtonContainer } from "components/Common";
import "./Actions.scss";

export default class Actions extends Component {
  state = {
    offSetTop: 0
  };
  componentWillReceiveProps({ offSetTop }) {
    if (offSetTop > 100) this.setState({ offSetTop: 120 });
    if (offSetTop === 0) this.setState({ offSetTop: 0 });
  }
  render() {
    return (
      <div
        className="clinician-survey-actions"
        style={{ marginTop: `-${this.state.offSetTop}px` }}
      >
        <Card title="Actions">
          <FollowUpOne />
          <FollowUpTwo />
          <ButtonContainer>
            <Button content="Face To Face" primary />
            <Button content="General Practictioner" secondary />
            <Button content="Accident & Emergency" secondary />
          </ButtonContainer>
        </Card>
      </div>
    );
  }
}
