import React, { Component } from "react";

import moment from "moment";

import {
  Card,
  Label,
  Button,
  FormRow,
  FormGroup,
  ButtonContainer
} from "components/Common";

export default class CaseDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUpdateModal: false
    };
  }

  renderStopCaseDetails = () => {
    const { mi3dCase } = this.props;
    if (mi3dCase.stopCaseReason !== null) {
      return (
        <>
          <FormRow>
            <FormGroup flexBasis="100" inline>
              <Label width="150" text="Stop Case Reason:" />
              <p>{mi3dCase.stopCaseReason}</p>
            </FormGroup>
          </FormRow>
          {mi3dCase.stopCaseSummary !== "" && (
            <FormRow>
              <FormGroup flexBasis="100" inline>
                <Label width="150" text="Stop Case Summary:" />
                <p>{mi3dCase.stopCaseSummary}</p>
              </FormGroup>
            </FormRow>
          )}
        </>
      );
    }
  };

  renderHoldCaseReason = () => {
    const { mi3dCase } = this.props;
    if (mi3dCase.holdCaseReason !== null && mi3dCase.status.includes("Hold")) {
      return (
        <>
          <FormRow>
            <FormGroup flexBasis="100" inline>
              <Label width="150" text="Hold Case Reason:" />
              <p>{mi3dCase.holdCaseReason}</p>
            </FormGroup>
          </FormRow>
        </>
      );
    }
  };

  renderResumeCase = () => {
    if (this.props.mi3dCase.status.includes("Hold"))
      return (
        <ButtonContainer justifyContent="flex-end">
          <Button content="Resume Case" onClick={this.resumeCase} primary />
        </ButtonContainer>
      );
  };

  resumeCase = async () => {
    await this.props.resumeCase();
  };

  render() {
    const { mi3dCase, bluedogCase } = this.props;
    return (
      <Card title="Case Details" id="caseDetails">
        <FormRow>
          <FormGroup flexBasis="100" inline>
            <Label width="150" text="Status:" />
            <p>{mi3dCase.status}</p>
          </FormGroup>
        </FormRow>
        {this.renderStopCaseDetails()}
        {this.renderHoldCaseReason()}
        <FormRow>
          <FormGroup flexBasis="100" inline>
            <Label width="150" text="Instructing Party:" />
            <p>{bluedogCase.instructingParty.name}</p>
          </FormGroup>
        </FormRow>
        <FormRow>
          {/* <FormGroup flexBasis="40" inline>
            <Label width="150" text="Disclosure Accepted:" />
            <p>{mi3dCase.disclosureAccepted ? "Yes" : "No"}</p>
          </FormGroup> */}
          <FormGroup flexBasis="40" inline>
            <Label width="150" text="Salaso Id:" />
            <p>
              {mi3dCase.salasoId !== null
                ? `${mi3dCase.salasoId}`
                : "Not started"}
            </p>
          </FormGroup>
          <FormGroup flexBasis="40" inline>
            <Label width="150" text="Course Duration:" />
            <p>
              {mi3dCase.courseDurationInWeeks !== 0
                ? `${mi3dCase.courseDurationInWeeks} weeks`
                : "Not started"}
            </p>
          </FormGroup>
        </FormRow>
        {/* <FormRow>
          <FormGroup flexBasis="40" inline>
            <Label width="150" text="Registered Date:" />
            <p>
              {mi3dCase.exerciseStartDate !== "0001-01-01T00:00:00"
                ? moment(mi3dCase.exerciseStartDate).format("DD/MM/YYYY")
                : "Not Registered"}
            </p>
          </FormGroup>
        </FormRow> */}
        <FormRow>
          <FormGroup flexBasis="40" inline>
            <Label width="150" text="Exercise Start Date:" />
            <p>
              {mi3dCase.exerciseStartDate !== "0001-01-01T00:00:00"
                ? moment(mi3dCase.exerciseStartDate).format("DD/MM/YYYY")
                : "Not started"}
            </p>
          </FormGroup>
          <FormGroup flexBasis="40" inline>
            <Label width="150" text="Prescribed Exercises:" />
            <p>
              {mi3dCase.numberOfPrescribedExercises !== 0
                ? mi3dCase.numberOfPrescribedExercises
                : "Not started"}
            </p>
          </FormGroup>
        </FormRow>
        {this.renderResumeCase()}
      </Card>
    );
  }
}
