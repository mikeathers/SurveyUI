import React, { Component } from "react";
import * as reason from "helpers/stopCaseReasons";

import FollowUpOne from "./FollowUpOne/FollowUpOne";
import FollowUpTwo from "./FollowUpTwo/FollowUpTwo";
import FollowUpThree from "./FollowUpThree/FollowUpThree";
import FollowUpFour from "./FollowUpFour/FollowUpFour";
import FollowUpFive from "./FollowUpFive/FollowUpFive";

import {
  Card,
  Button,
  FlexBox,
  Message,
  ButtonContainer
} from "components/Common";

import "./Actions.scss";

export default class Actions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      stopSurvey: false,
      showMessage: false,
      errorMessage: false,
      followUpToDisplay:
        props.followUpToDisplay !== undefined
          ? props.followUpToDisplay
          : "followUpOne"
    };
  }

  componentWillReceiveProps({
    message,
    stopSurvey,
    showMessage,
    errorMessage,
    followUpToDisplay
  }) {
    this.setState({
      message,
      stopSurvey,
      showMessage,
      errorMessage,
      followUpToDisplay
    });
  }

  renderFollowUp = () => {
    switch (this.state.followUpToDisplay) {
      case "followUpOne":
        return <FollowUpOne id="followUpOne" />;
      case "followUpTwo":
        return <FollowUpTwo id="followUpTwo" />;
      case "followUpThree":
        return <FollowUpThree id="followUpThree" />;
      case "followUpFour":
        return <FollowUpFour id="followUpFour" />;
      case "followUpFive":
        return <FollowUpFive id="followUpFive" />;
      default:
        break;
    }
  };

  sendIpToAandE = () => {
    this.props.handleOpenStopCaseModal(
      "Injured party should go to A&E",
      "Stop Case",
      "Based on the answers you have provided, you need to go to A&E.",
      reason.clinicianSurveyKOAandE
    );
  };

  sendIpToGp = () => {
    this.props.handleOpenStopCaseModal(
      "Injured party should go to their GP",
      "Stop Case",
      "Based on the answers you have provided, you need to go to your GP.",
      reason.clinicianSurveyKOGP
    );
  };

  sendIpToF2F = () => {
    this.props.handleOpenStopCaseModal(
      "Injured party needs Face to Face treatment",
      "Stop Case",
      "Based on the answers you have provided, you need to face to face treatment.",
      reason.clinicianSurveyKOF2F
    );
  };

  renderButtons = () => {
    switch (this.state.followUpToDisplay) {
      case "followUpOne":
        return (
          <div id="followUpOneBtns">
            <Button
              secondary
              content="Face To Face"
              onClick={this.sendIpToF2F}
              disabled={!this.state.stopSurvey}
            />
            <Button
              secondary
              content="A&E"
              onClick={this.sendIpToAandE}
              disabled={!this.state.stopSurvey}
            />
          </div>
        );
      case "followUpTwo":
        return (
          <div id="followUpTwoBtns">
            <Button
              secondary
              content="Face To Face"
              onClick={this.sendIpToF2F}
              disabled={!this.state.stopSurvey}
            />
            <Button
              secondary
              content="GP"
              onClick={this.sendIpToGp}
              disabled={!this.state.stopSurvey}
            />
          </div>
        );
      case "followUpThree":
        return (
          <div id="followUpThreeBtns">
            <Button
              secondary
              content="Face To Face"
              onClick={this.sendIpToF2F}
              disabled={!this.state.stopSurvey}
            />
            <Button
              secondary
              content="GP"
              onClick={this.sendIpToGp}
              disabled={!this.state.stopSurvey}
            />
            <Button
              secondary
              content="A&E"
              onClick={this.sendIpToAandE}
              disabled={!this.state.stopSurvey}
            />
          </div>
        );
      case "followUpFour":
        return (
          <div id="followUpFourBtns">
            <Button
              secondary
              content="Face To Face"
              onClick={this.sendIpToF2F}
              disabled={!this.state.stopSurvey}
            />
          </div>
        );
      case "followUpFive":
        return (
          <div id="followUpFiveBtns">
            <Button
              secondary
              content="Face To Face"
              onClick={this.sendIpToF2F}
              disabled={!this.state.stopSurvey}
            />
            <Button
              secondary
              content="GP"
              onClick={this.sendIpToGp}
              disabled={!this.state.stopSurvey}
            />
            <Button
              secondary
              content="A&E"
              onClick={this.sendIpToAandE}
              disabled={!this.state.stopSurvey}
            />
          </div>
        );
      default:
        return;
    }
  };

  render() {
    return (
      <div
        id="clinicianSurveyActions"
        className="clinician-survey-actions"
        style={{ marginTop: `-${this.state.offSetTop}px` }}
      >
        <Card
          title="Actions"
          id="clinicianSurveyActionsCard"
          disabled={this.props.checkIfSurveyCanBeAnswered()}
        >
          <div className="clinician-survey-actions__content">
            {this.renderFollowUp()}
          </div>
          <ButtonContainer justifyContent="space-between">
            {this.renderButtons()}
            <div>
              <Button
                primary
                content="Continue Survey"
                disabled={!this.state.stopSurvey}
                onClick={this.props.continueSurvey}
                id="clinicianSurveyContinueSurveyBtn"
              />
              <Button
                primary
                content="Complete Survey"
                onClick={this.props.submitSurvey}
                id="clinicianSurveyCompleteSurveyBtn"
                disabled={this.props.surveyNotComplete}
              />
            </div>
          </ButtonContainer>
          <FlexBox justifyContent="flex-end">
            <Message
              marginTop="20"
              message={this.state.message}
              show={this.state.showMessage}
              error={this.state.errorMessage}
            />
          </FlexBox>
        </Card>
      </div>
    );
  }
}
