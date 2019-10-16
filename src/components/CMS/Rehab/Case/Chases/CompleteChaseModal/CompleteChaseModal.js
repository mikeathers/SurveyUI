import React, { Component } from "react";
import * as api from "api";
import * as systemActivities from "helpers/systemActivities";
import * as emailTemplates from "helpers/emailTemplates";
import Modal from "react-modal";
import DatePicker from "react-datepicker";

import { addSystemActivity, updateSystemActivity } from "helpers/util";

import {
  emailInjuredParty,
  emailInstructingParty,
  getBluedogInjuredPartyValues
} from "helpers/email";

import {withErrorHandling} from "HOCs";
import InjuredPartyContactDetails from "components/CMS/Rehab/Case/InjuredPartyContactDetails/InjuredPartyContactDetails";

import {
  Label,
  Button,
  Message,
  FlexBox,
  FormRow,
  Checkbox,
  FormGroup,
  ButtonContainer
} from "components/Common";

import "./CompleteChaseModal.scss";

class CompleteChaseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      bluedogCaseValues: null,
      exerciseStartDate: new Date(),
      surpressCorrespondence: false,
      compliantChaseSubmitted: false,
      nonCompliantChaseSubmitted: false
    };
    this.getBluedogInjuredPartyValues = getBluedogInjuredPartyValues.bind(this);
    this.addSystemActivity = addSystemActivity.bind(this);
    this.updateSystemActivity = updateSystemActivity.bind(this);
    this.emailInstructingParty = emailInstructingParty.bind(this);
    this.emailInjuredParty = emailInjuredParty.bind(this);
  }

  componentDidMount() {
    this._mounted = true;
    if (this.props.bluedogCase !== undefined)
      this.getBluedogInjuredPartyValues(this.props.bluedogCase);
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  handleExerciseStartDateChange = date => {
    this._mounted && this.setState({ exerciseStartDate: date });
  };

  chase = compliant => ({
    ...this.props.chase,
    completedBy: this.props.username,
    compliant,
    exerciseStartDate: this.state.exerciseStartDate
  });

  markChaseAsCompliant = async () => {
    this.setState({ compliantChaseSubmitted: true });
    const chaseCompleted = await this.completeChase(this.chase(true));
    if (chaseCompleted) {
      this.setState({ compliantChaseSubmitted: false });
      this.moveToNextSurvey();
      this.closeModal();
    }
  };

  markChaseAsNoncompliant = async () => {
    try {
      this.setState({ nonCompliantChaseSubmitted: true, showLoader: true });
      const chaseCompleted = await this.completeChase(this.chase(false));
      if (chaseCompleted && this.surpressCorrespondence()) {
        this.closeModal();
        this.setState({ nonCompliantChaseSubmitted: false });
        this.chaseIsFinalNonCompliantChase() &&
          (await this.placeCaseOnHold("Injured Party Non-Compliant"));
      } else {
        this.closeModal();
        await this.handleEmailInstructingParty();
        await this.handleEmailInjuredParty();
        this.setState({ nonCompliantChaseSubmitted: false });
        this.chaseIsFinalNonCompliantChase() &&
          (await this.placeCaseOnHold("Injured Party Non-Compliant"));
      }
    } catch {
      this.props.showErrorModal();
    }
  };

  chaseIsFinalNonCompliantChase = () => {
    return this.props.chase.name === "PostClinicalAssessmentChaseThree";
  };

  handleEmailInstructingParty = async () => {
    const { bluedogCaseValues } = this.state;
    const { chase } = this.props;
    if (chase.name === "PostClinicalAssessmentChaseThree") {
      const emailTemplateName =
        emailTemplates.postClinicalAssessmentChaseThreeInsP;

      const activity = systemActivities.emailInsPChaseNonCompliance;

      const systemActivity = {
        activity,
        type: "Email",
        state: "Pending",
        emailTemplateName: null,
        bluedogActionName: null,
        surveyDocumentNeedsSending: false,
        sendTo: "Instructing Party"
      };

      await this.emailInstructingParty(
        systemActivity,
        emailTemplateName,
        bluedogCaseValues
      );
    }
  };

  handleEmailInjuredParty = async () => {
    const { bluedogCaseValues } = this.state;
    const { chase } = this.props;
    let emailTemplateName;
    let activity;

    if (
      chase.name === "PostClinicalAssessmentChaseOne" ||
      chase.name == "PostClinicalAssessmentChaseTwo"
    ) {
      if (chase.name === "PostClinicalAssessmentChaseOne") {
        emailTemplateName = emailTemplates.postClinicalAssessmentChaseOneIP;
        activity =
          systemActivities.emailIPPostClinicalAssessmentChaseOneNonCompliance;
      }

      if (chase.name === "PostClinicalAssessmentChaseTwo") {
        emailTemplateName = emailTemplates.postClinicalAssessmentChaseTwoIP;
        activity =
          systemActivities.emailIPPostClinicalAssessmentChaseTwoNonCompliance;
      }

      const systemActivity = {
        activity,
        type: "Email",
        state: "Pending",
        emailTemplateName: null,
        bluedogActionName: null,
        surveyDocumentNeedsSending: false,
        sendTo: "Injured Party"
      };

      await this.emailInjuredParty(
        systemActivity,
        emailTemplateName,
        bluedogCaseValues
      );
    }
  };

  handleFinalSOAPChase = () => {
    const bluedogCaseRef = this.props.chase.bluedogReference;
    if (
      this.props.chase.name === "SOAPSurveyChaseTwo" ||
      this.props.chase.name === "SOAPSurveyFurtherTreatmentChase" ||
      this.props.chase.name === "DischargeSurveyFurtherTreatmentChase"
    )
      this.props.history.push(`/cms/rehab/survey/discharge/${bluedogCaseRef}`);
  };

  completeChase = async chase => {
    const completeChaseResult = await api.completeChase(chase);
    if (completeChaseResult !== undefined) {
      if (completeChaseResult.status === 200) {
        this.props.updateMi3dCase(completeChaseResult.data);
        return true;
      } else {
        this.showErrorMessage(completeChaseResult.data[0].errorMessage);
        return false;
      }
    } else this.props.showErrorModal();
  };

  placeCaseOnHold = async holdCaseReason => {
    const holdCaseInfo = {
      holdCaseReason,
      caseId: this.props.mi3dCase.caseId
    };

    const response = await api.placeCaseOnHold(holdCaseInfo);

    if (response !== undefined) {
      if (response.status === 200) this.props.updateMi3dCase(response.data);
      else this.showErrorMessage(response.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  moveToNextSurvey = () => {
    const nextSurveyName = this.getNextSurvey();
    const bluedogCaseRef = this.props.chase.bluedogReference;
    if (nextSurveyName !== null) {
      this.closeModal();
      setTimeout(
        () =>
          this.props.history.push(
            `/cms/rehab/survey/${nextSurveyName}/${bluedogCaseRef}`
          ),
        500
      );
    }
  };

  getNextSurvey = () => {
    const chaseName = this.props.chase.name;
    if (chaseName.includes("SOAP")) return "soap";
    if (chaseName.includes("Discharge")) return "discharge";
    return null;
  };

  checkIfPostClinicalChase = () => {
    if (this.props.chase !== null) {
      return (
        this.props.chase.name === "PostClinicalAssessmentChaseOne" ||
        this.props.chase.name === "PostClinicalAssessmentChaseTwo" ||
        this.props.chase.name === "PostClinicalAssessmentChaseThree"
      );
    }
  };

  showErrorMessage = message => {
    this._mounted &&
      this.setState({
        message,
        showMessage: true,
        errorMessage: true
      });
    setTimeout(() => this.setState({ showMessage: false }), 3000);
  };

  handleSurpressCorrespondence = () => {
    this.setState({
      surpressCorrespondence: !this.state.surpressCorrespondence
    });
  };

  surpressCorrespondence = () => {
    return this.state.surpressCorrespondence;
  };

  closeModal = () => {
    this.props.closeModal();
    this.setState({
      showLoader: false,
      chaseSubmitted: false,
      surpressCorrespondence: false
    });
  };

  render() {
    const { isModalOpen, chase, closeModal } = this.props;
    const className = !this.checkIfPostClinicalChase()
      ? "chase-complete-modal"
      : "chase-complete-modal chase-complete-modal--initial";
    return (
      <Modal
        ariaHideApp={false}
        isOpen={isModalOpen}
        id="completeChaseModal"
        contentLabel="Complete Chase Modal"
        className={className}
      >
        <div className="chase-complete-modal__header">
          <h3>Complete Chase</h3>
        </div>
        <hr />

        <div className="chase-complete-modal__body">
          <div className="chase-complete-modal__description">
            <p className="strong">Chase Description:</p>
            <p>{chase !== null && chase.description}</p>
          </div>

          {chase !== null && this.checkIfPostClinicalChase() ? (
            <>
              <p>Have you been able to complete this chase action?</p>
              <div className="chase-complete-modal__course-duration">
                <FormRow>
                  <FormGroup flexBasis="30">
                    <Label text="Exercise Start Date:" />
                    <FlexBox alignItems="center">
                      <DatePicker
                        id="completeChaseModalExerciseStartDate"
                        selected={this.state.exerciseStartDate}
                        onChange={this.handleExerciseStartDateChange}
                        dateFormat="dd/MM/yyyy"
                      />
                    </FlexBox>
                  </FormGroup>
                </FormRow>
              </div>
            </>
          ) : (
            <>
              <p className="strong">
                Establish contact with the Injured Party and mark the chase as
                Compliant or if you have not been able to contact them, mark the
                chase as Non-compliant.
              </p>
              <InjuredPartyContactDetails
                mi3dCase={this.props.mi3dCase}
                username={this.props.username}
                bluedogCase={this.props.bluedogCase}
                updateMi3dCase={this.props.updateMi3dCase}
                updateBluedogCase={this.props.updateBluedogCase}
              />
            </>
          )}
        </div>
        <div className="chase-complete-modal__surpress-correspondence">
          <FormRow>
            <FormGroup flexBasis="100">
              <FlexBox alignItems="center">
                <Checkbox
                  label="Surpress correspondence for non-compliant chase"
                  checked={this.state.surpressCorrespondence}
                  onChange={this.handleSurpressCorrespondence}
                />
              </FlexBox>
            </FormGroup>
          </FormRow>
        </div>
        <hr />
        <div className="chase-complete-modal__footer">
          <ButtonContainer marginTop="25" justifyContent="space-between">
            <Button
              secondary
              content="Cancel"
              onClick={closeModal}
              disabled={
                this.state.compliantChaseSubmitted ||
                this.state.nonCompliantChaseSubmitted
              }
            />
            <FlexBox>
              <Message
                show={this.state.showMessage}
                error={this.state.errorMessage}
                message={this.state.message}
                marginRight={35}
              />
              <Button
                content="Reschedule Chase"
                secondary
                onClick={this.props.showExtendChaseDateModal}
                disabled={
                  this.state.compliantChaseSubmitted ||
                  this.state.nonCompliantChaseSubmitted
                }
              />
              <Button
                content="Non Compliant"
                secondary
                onClick={this.markChaseAsNoncompliant}
                disabled={
                  this.state.compliantChaseSubmitted ||
                  this.state.nonCompliantChaseSubmitted
                }
                loading={this.state.nonCompliantChaseSubmitted}
              />

              <Button
                content="Compliant"
                primary
                onClick={this.markChaseAsCompliant}
                disabled={
                  this.state.compliantChaseSubmitted ||
                  this.state.nonCompliantChaseSubmitted
                }
                loading={this.state.compliantChaseSubmitted}
              />
            </FlexBox>
          </ButtonContainer>
        </div>
      </Modal>
    );
  }
}

export default withErrorHandling(CompleteChaseModal);
