import React, { Component } from "react";
import * as reasons from "helpers/stopCaseReasons";

import {
  validateItem,
  validateItems,
  setItemToValidate,
  validateListOfStrings,
  removeValidationErrors
} from "helpers/validation";

import {
  Form,
  Card,
  Input,
  Label,
  Button,
  Message,
  FlexBox,
  TextArea,
  RadioButton,
  ButtonContainer
} from "components/Common";

import "./CaseCompletion.scss";

export default class CaseCompletion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      clinicianHCPC: "",
      showMessage: false,
      closingSummary: "",
      errorMessage: false,
      returnedToWork: true,
      surveyComplete: false,
      invalidVASItems: false,
      invalidPSFSItems: false,
      invalidPainKillers: false,
      removeValidationWarning: false,
      injuredPartyCompliant: true,
      compliantSelectedAnswer: "Yes",
      injuredPartyResumedHobbies: true,
      injuredPartyReturnedToWork: true,
      resumedHobbiesSelectedAnswer: "Yes",
      returnedToWorkSelectedAnswer: "Yes",
      injuredPartyCompletedTreatmentPlan: true,
      completedTreatmentPlanSelectedAnswer: "Yes"
    };

    this.validateItem = validateItem.bind(this);
    this.validateItems = validateItems.bind(this);
    this.setItemToValidate = setItemToValidate.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
  }

  componentWillReceiveProps({
    clinicianHCPC,
    surveyComplete,
    closingSummary,
    returnedToWork,
    invalidVASItems,
    invalidPSFSItems,
    invalidPainKillers,
    injuredPartyCompliant,
    injuredPartyResumedHobbies,
    injuredPartyReturnedToWork,
    injuredPartyCompletedTreatmentPlan
  }) {
    if (invalidPSFSItems !== undefined) this.setState({ invalidPSFSItems });
    if (invalidVASItems !== undefined) this.setState({ invalidVASItems });
    if (invalidPainKillers !== undefined) this.setState({ invalidPainKillers });
    if (surveyComplete !== undefined) this.setState({ surveyComplete });
    if (closingSummary !== undefined) this.setState({ closingSummary });
    if (returnedToWork !== undefined) this.setState({ returnedToWork });
    if (clinicianHCPC !== undefined) this.setState({ clinicianHCPC });

    if (injuredPartyCompletedTreatmentPlan !== undefined && surveyComplete)
      this.setState({
        completedTreatmentPlanSelectedAnswer: injuredPartyCompletedTreatmentPlan
          ? "Yes"
          : "No"
      });

    if (injuredPartyResumedHobbies !== undefined && surveyComplete)
      this.setState({
        resumedHobbiesSelectedAnswer: injuredPartyResumedHobbies ? "Yes" : "No"
      });

    if (injuredPartyReturnedToWork !== undefined && surveyComplete)
      this.setState({
        returnedToWorkSelectedAnswer: injuredPartyReturnedToWork ? "Yes" : "No"
      });

    if (injuredPartyCompliant !== undefined && surveyComplete)
      this.setState({
        compliantSelectedAnswer: injuredPartyCompliant ? "Yes" : "No"
      });
  }

  handleChange = (e, { name, value }) => {
    this.hideErrorMessage();
    this.setItemToValidate(name);
    this.setState({ [name]: value }, () => {
      if (name === "closingSummary") this.handleClosingSummary();
      if (name === "clinicianHCPC") this.handleClinicianHCPC();
    });
  };

  handleInjuredPartyCompliant = selectedAnswer => {
    this.hideErrorMessage();
    this.setState(
      {
        compliantSelectedAnswer: selectedAnswer,
        injuredPartyCompliant: selectedAnswer === "Yes" ? true : false
      },
      () => {
        this.props.returnInjuredPartyCompliant(selectedAnswer);
      }
    );
  };

  handleInjuredPartyResumedHobbies = selectedAnswer => {
    this.setState(
      {
        resumedHobbiesSelectedAnswer: selectedAnswer,
        injuredPartyResumedHobbies: selectedAnswer === "Yes" ? true : false
      },
      () => {
        this.props.returnInjuredPartyResumedHobbies(selectedAnswer);
      }
    );
  };

  handleInjuredPartyReturnedToWork = selectedAnswer => {
    this.setState(
      {
        returnedToWorkSelectedAnswer: selectedAnswer,
        injuredPartyReturnedToWork: selectedAnswer === "Yes" ? true : false
      },
      () => {
        this.props.returnInjuredPartyReturnedToWork(selectedAnswer);
      }
    );
  };

  handleInjuredPartyCompletedTreatmentPlan = selectedAnswer => {
    this.hideErrorMessage();
    this.setState(
      {
        completedTreatmentPlanSelectedAnswer: selectedAnswer,
        injuredPartyCompletedTreatmentPlan:
          selectedAnswer === "Yes" ? true : false
      },
      () => {
        this.props.returnInjuredPartyCompletedTreatmentPlan(selectedAnswer);
      }
    );
  };

  handleClosingSummary = () => {
    this.props.returnClosingSummary(this.state.closingSummary);
  };

  handleClinicianHCPC = () => {
    this.props.returnClinicianHCPC(this.state.clinicianHCPC);
  };

  handleVasAndPSFSValdiation = () => {
    this.props.checkIfVASIsValid();
    this.props.checkIfPSFSIsValid();
    this.props.checkIfPainKillersValid();
  };

  listToValidate = () => {
    return [
      { clinicianHCPC: this.state.clinicianHCPC },
      { closingSummary: this.state.closingSummary }
    ];
  };

  submitSurvey = () => {
    if (this.state.injuredPartyCompliant) {
      this.handleVasAndPSFSValdiation();
      var list = validateListOfStrings(this.listToValidate());
      if (list[list.length - 1].isValid) {
        this.props.showSurveyCompleteModal();
      } else {
        this.validateItems(list);
        this.showErrorMessage("Please complete all fields before submitting");
      }
    } else {
      var list = validateListOfStrings(this.listToValidate());
      if (list[list.length - 1].isValid) {
        this.props.showSurveyCompleteModal();
      } else {
        this.validateItems(list);
        this.showErrorMessage("Please complete all fields before submitting");
      }
    }
  };

  faceToFaceNeeded = () => {
    this.handleVasAndPSFSValdiation();
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      this.props.handleOpenStopCaseModal(
        "Injured party needs Face to Face treatment",
        "Stop Case",
        "We would be happy to refer you to face to face treatment.",
        reasons.dischargeSurveyCompleteF2FNeeded
      );
    } else {
      this.validateItems(list);
      this.showErrorMessage("Please complete all fields before submitting");
    }
  };

  showErrorMessage = message => {
    this.setState({
      showMessage: true,
      message,
      errorMessage: true
    });
  };

  hideErrorMessage = () => {
    this.removeValidationErrors(this.listToValidate());
    this.setState({
      showMessage: false,
      message: "",
      errorMessage: false
    });
  };

  render() {
    return (
      <Card
        title="Complete Case"
        id="dischargeSurveyCaseCompletion"
        disabled={this.state.surveyComplete}
      >
        <div className="case-completion">
          <div
            id="dischargeSurveyClinicianHPHC"
            className="case-completion__clinician-hphc"
          >
            <Label text="Clinician HCPC:" />
            <Input
              placeholder="123456"
              name="clinicianHCPC"
              onChange={this.handleChange}
              value={this.state.clinicianHCPC}
              id="dischargeSurveyClinicianHPHCTextbox"
              valid={this.validateItem("clinicianHCPC").toString()}
            />
          </div>
          <div
            id="dischargeSurveyContactedIP"
            className="case-completion__contacted-ip"
          >
            <p>Have you been able to contact the Injured Party?</p>
            <div className="case-completion__buttons">
              <RadioButton
                label="Yes"
                id="dischargeSurveyYesRadioBtn"
                checked={this.state.compliantSelectedAnswer === "Yes"}
                onChange={() => this.handleInjuredPartyCompliant("Yes")}
              />
              <RadioButton
                label="No"
                id="dischargeSurveyNoRadioBtn"
                checked={this.state.compliantSelectedAnswer === "No"}
                onChange={() => this.handleInjuredPartyCompliant("No")}
              />
            </div>
          </div>
          <div
            id="dischargeSurveyResumedHobbies"
            className="case-completion__completed-treatment-plan"
          >
            <p>Has the Injured Party completed the treatment plan?</p>
            <div className="case-completion__buttons">
              <RadioButton
                label="Yes"
                id="dischargeSurveyCompletedTreatmentPlanYesRadioBtn"
                onChange={() =>
                  this.handleInjuredPartyCompletedTreatmentPlan("Yes")
                }
                checked={
                  this.state.completedTreatmentPlanSelectedAnswer === "Yes"
                }
              />
              <RadioButton
                label="No"
                id="dischargeSurveyCompletedTreatmentPlanNoRadioBtn"
                onChange={() =>
                  this.handleInjuredPartyCompletedTreatmentPlan("No")
                }
                checked={
                  this.state.completedTreatmentPlanSelectedAnswer === "No"
                }
              />
            </div>
          </div>
          {this.state.compliantSelectedAnswer === "Yes" && (
            <div>
              <div
                id="dischargeSurveyResumedHobbies"
                className="case-completion__resume-daily-hobbies"
              >
                <p>
                  Has the Injured Party been able to resume their daily
                  activities/hobbies?
                </p>
                <div className="case-completion__buttons">
                  <RadioButton
                    label="Yes"
                    id="dischargeSurveyResumedHobbiesYesRadioBtn"
                    checked={this.state.resumedHobbiesSelectedAnswer === "Yes"}
                    onChange={() =>
                      this.handleInjuredPartyResumedHobbies("Yes")
                    }
                  />
                  <RadioButton
                    label="No"
                    id="dischargeSurveyResumedHobbiesNoRadioBtn"
                    checked={this.state.resumedHobbiesSelectedAnswer === "No"}
                    onChange={() => this.handleInjuredPartyResumedHobbies("No")}
                  />
                </div>
              </div>

              {this.state.returnedToWork === "No" && (
                <div
                  className="case-completion__returned-to-work"
                  id="dischargeSurveyReturnedToWork"
                >
                  <p>
                    Has the Injured Party been able to return to school/work?
                  </p>
                  <div className="case-completion__buttons">
                    <RadioButton
                      label="Yes"
                      id="dischargeSurveyReturnedToWorkYesRadioBtn"
                      onChange={() =>
                        this.handleInjuredPartyReturnedToWork("Yes")
                      }
                      checked={
                        this.state.returnedToWorkSelectedAnswer === "Yes"
                      }
                    />
                    <RadioButton
                      label="No"
                      id="dischargeSurveyReturnedToWorkNoRadioBtn"
                      checked={this.state.returnedToWorkSelectedAnswer === "No"}
                      onChange={() =>
                        this.handleInjuredPartyReturnedToWork("No")
                      }
                    />
                  </div>
                </div>
              )}
              <div
                id="dischargeSurveyClosingStatement"
                className="case-completion__closing-statement"
              >
                <p>
                  "As your symptoms have significantly improved / resolved, I am
                  happy to now discharge you from the service.
                </p>
                <p>
                  {" "}
                  You may receive a customer satisfaction survey to complete,
                  that we would appreciate your feedback and return to us.{" "}
                </p>
                <p>
                  Thank you very much for your time today, and I wish you all
                  the best."{" "}
                </p>
              </div>
            </div>
          )}
          <div className="case-completion__closing-summary">
            <p className="strong">Closing Summary:</p>
            <Form>
              <TextArea
                name="closingSummary"
                onChange={this.handleChange}
                value={this.state.closingSummary}
                placeholder="The injured party has..."
                id="dischargeSurveyClosingSummaryTextBox"
                valid={this.validateItem("closingSummary").toString()}
              />
            </Form>
          </div>
          <ButtonContainer justifyContent="space-between" marginTop="25">
            <Button
              secondary
              content="Further Treatment Needed"
              id="dischargeSurveyFurtherTreatmentBtn"
              onClick={this.props.extendCourseDuration}
              disabled={this.props.furtherTreatmentAlreadyAdded()}
            />
            <FlexBox>
              <Button
                secondary
                id="dischargeSurveyF2FBtn"
                onClick={this.faceToFaceNeeded}
                content="Face to Face Needed"
              />
              <Button
                primary
                content="Complete Case"
                onClick={this.submitSurvey}
                id="dischargeSurveySubmitBtn"
              />
            </FlexBox>
          </ButtonContainer>
          <FlexBox justifyContent="flex-end">
            <Message
              marginTop={25}
              message={this.state.message}
              show={this.state.showMessage}
              error={this.state.errorMessage}
              id="dischargeSurveyValidationMessage"
            />
          </FlexBox>
        </div>
      </Card>
    );
  }
}
