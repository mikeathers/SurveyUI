import React, { Component } from "react";
import * as api from "api";
import Modal from "react-modal";
import { connect } from "react-redux";
import { updateMi3dCase } from "actions";
import { withErrorHandling } from "HOCs";

import { addSystemActivity, updateSystemActivity } from "helpers/util";

import {
  emailInstructingParty,
  emailInjuredParty,
  getBluedogInjuredPartyValues
} from "helpers/email";

import {
  validateItem,
  validateItems,
  setItemToValidate,
  validateListOfStrings,
  removeValidationErrors
} from "helpers/validation";

import {
  Form,
  Button,
  Message,
  FormRow,
  Dropdown,
  Checkbox,
  TextArea,
  FormGroup,
  ButtonContainer
} from "components/Common";

import "./StopCaseModal.scss";

export class StopCaseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      emailToSend: null,
      showLoader: false,
      showMessage: false,
      additionalInfo: "",
      errorMessage: false,
      stopCaseReasons: [],
      bluedogCaseValues: [],
      documentToCreate: null,
      holdCaseSubmitted: false,
      emailToSendDetails: null,
      surveyDocumentToSend: "",
      selectedStopCaseReasonId: "",
      surpressCorrespondence: false,
      stopCaseReasonsForDropdown: []
    };

    this.validateItem = validateItem.bind(this);
    this.validateItems = validateItems.bind(this);
    this.setItemToValidate = setItemToValidate.bind(this);
    this.addSystemActivity = addSystemActivity.bind(this);
    this.updateSystemActivity = updateSystemActivity.bind(this);
    this.emailInstructingParty = emailInstructingParty.bind(this);
    this.emailInjuredParty = emailInjuredParty.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
    this.getBluedogInjuredPartyValues = getBluedogInjuredPartyValues.bind(this);
  }

  componentWillMount() {
    this.getStopCaseReasons();
  }

  componentDidMount() {
    this._isMounted = true;
    this.getBluedogInjuredPartyValues(this.props.bluedogCase);
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.setState({
      message: "",
      showLoader: false,
      showMessage: false,
      errorMessage: false
    });
  }

  componentWillReceiveProps({ stopCaseReason }) {
    this.preselectStopCaseReasonInDropdown(stopCaseReason);
  }

  getStopCaseReasons = async () => {
    const response = await api.getStopCaseReasons();
    if (response !== undefined) {
      if (response.status === 200) {
        this.setState({ stopCaseReasons: response.data });
        this.mapStopCaseReasonsForDropdown(response.data);
      } else this.props.showErrorModal();
    }
  };

  mapStopCaseReasonsForDropdown = stopCaseReasons => {
    const stopCaseReasonsForDropdown = stopCaseReasons.map(reason => ({
      text: reason.text,
      value: reason.stopCaseReasonId
    }));
    this.setState({ stopCaseReasonsForDropdown });
  };

  preselectStopCaseReasonInDropdown = async stopCaseReason => {
    if (this.state.stopCaseReasons !== undefined) {
      const stopCaseReasonToShow = this.state.stopCaseReasons.find(
        reason => reason.text === stopCaseReason
      );
      if (stopCaseReasonToShow !== undefined)
        this.setState({
          selectedStopCaseReasonId: stopCaseReasonToShow.stopCaseReasonId
        });
    }
  };

  listToValidate = () => {
    return [{ selectedStopCaseReasonId: this.state.selectedStopCaseReasonId }];
  };

  getStopCaseReason = id => {
    return this.state.stopCaseReasons.find(m => m.stopCaseReasonId === id);
  };

  handleChange = (e, { name, value }) => {
    this.hideValidationMessage();
    this.setItemToValidate(name);
    this.setState({ [name]: value });
  };

  handleReasonChange = async (e, { name, value }) => {
    this.hideValidationMessage();
    this.setItemToValidate(name);
    this.setState({ [name]: value });
  };

  handleEmailInstructingParty = async (
    stopCaseReason,
    bluedogCaseValues,
    surveyDocumentToSend
  ) => {
    try {
      const emailTemplate = stopCaseReason.emailTemplates.find(
        m => m.sendTo === "Instructing Party"
      );

      if (emailTemplate !== undefined) {
        const emailTemplateName = emailTemplate.name;
        const systemActivity = {
          activity: `Email Instructing Party - ${stopCaseReason.text}`,
          type: "Email",
          state: "Pending"
        };

        await this.emailInstructingParty(
          systemActivity,
          emailTemplateName,
          bluedogCaseValues,
          surveyDocumentToSend
        );
      }
    } catch (e) {
      this.props.showErrorModal();
    }
  };

  handleEmailInjuredParty = async (
    stopCaseReason,
    bluedogCaseValues,
    surveyDocumentToSend
  ) => {
    try {
      const emailTemplate = stopCaseReason.emailTemplates.find(
        m => m.sendTo === "Injured Party"
      );
      if (emailTemplate !== undefined) {
        const emailTemplateName = emailTemplate.name;
        const systemActivity = {
          activity: `Email Injured Party - ${stopCaseReason.text}`,
          type: "Email",
          state: "Pending"
        };
        await this.emailInjuredParty(
          systemActivity,
          emailTemplateName,
          bluedogCaseValues,
          surveyDocumentToSend
        );
      }
    } catch (e) {
      this.props.showErrorModal();
    }
  };

  handleCorrespondence = async (stopCaseReason, surveyDocumentToSend) => {
    const { bluedogCaseValues } = this.state;

    if (
      stopCaseReason.sendsCorrespondence &&
      !this.state.surpressCorrespondence
    ) {
      await this.handleEmailInstructingParty(
        stopCaseReason,
        bluedogCaseValues,
        surveyDocumentToSend
      );
      await this.handleEmailInjuredParty(
        stopCaseReason,
        bluedogCaseValues,
        surveyDocumentToSend
      );
    }
  };

  stopCase = async () => {
    const {
      initialSurvey,
      clinicianSurvey,
      dischargeSurvey,
      completedClinicianSurvey
    } = this.props;

    this.closeModal();
    this.goBackToCase();

    const stopCaseReason = this.getStopCaseReason(
      this.state.selectedStopCaseReasonId
    );

    const systemActivityId = await this.addSystemActivity(
      `Stopping Case - ${stopCaseReason.text}`,
      "Case",
      "Pending"
    );
    const stopCaseInfo = {
      stopCaseReason: stopCaseReason.text,
      stopCaseSummary: this.state.additionalInfo,
      actionedBy: this.props.username,
      caseId: this.props.mi3dCase.caseId
    };

    let surveyDocumentToSend;

    if (initialSurvey) surveyDocumentToSend = await this.handleInitialSurvey();

    if (clinicianSurvey)
      surveyDocumentToSend = await this.handleClinicianSurvey();

    if (completedClinicianSurvey)
      surveyDocumentToSend = await this.handleCompletedClinicianSurvey();

    if (dischargeSurvey)
      surveyDocumentToSend = await this.handleDischargeSurvey();

    const stopCaseResponse = await api.stopCase(stopCaseInfo);

    if (stopCaseResponse.status === 200) {
      this.props.updateMi3dCase(stopCaseResponse.data);
      await this.updateSystemActivity(systemActivityId, "Success");
      await this.handleCorrespondence(stopCaseReason, surveyDocumentToSend);
      await this.handleBluedogCase(stopCaseReason);
    } else await this.updateSystemActivity(systemActivityId, "Error");
  };

  handleBluedogCase = async stopCaseReason => {
    const { additionalInfo } = this.state;
    const bluedogWatchList = stopCaseReason.bluedogWatchList;

    if (
      stopCaseReason.bluedogWatchList !== "" &&
      stopCaseReason.bluedogWatchList !== null &&
      stopCaseReason.bluedogWatchList !== undefined
    ) {
      const systemActivityId = await this.addSystemActivity(
        "Update Internal Case ",
        "Case",
        "Pending",
        null,
        bluedogWatchList
      );

      if (additionalInfo !== "")
        this.addNoteToBluedogCase(
          `Mi3D Case Stopped - ${stopCaseReason.text} - ${additionalInfo}`
        );
      else
        this.addNoteToBluedogCase(`Mi3D Case Stopped - ${stopCaseReason.text}`);

      const response = await api[bluedogWatchList](this.props.bluedogCaseRef);

      if (response.status === 200)
        await this.updateSystemActivity(systemActivityId, "Success");
      else await this.updateSystemActivity(systemActivityId, "Error");
    }
  };

  handleInitialSurvey = async () => {
    if (!this.props.initialKO) {
      const surveyDocumentToSend = await this.props.saveCompletedInitialSurveyWhenKnockedOut();
      return surveyDocumentToSend;
    }
  };

  handleClinicianSurvey = async () => {
    const surveyDocumentToSend = await this.props.saveCompletedClinicianSurvey();
    return surveyDocumentToSend;
  };

  handleCompletedClinicianSurvey = () => {
    return this.props.initialSurveyDocument;
  };

  handleDischargeSurvey = async () => {
    const surveyDocumentToSend = await this.props.saveCompletedDischargeSurveyWhenKnockedOut();
    return surveyDocumentToSend;
  };

  handleValidation = () => {
    var list = validateListOfStrings(this.listToValidate());
    if (list[list.length - 1].isValid) {
      this.stopCase();
    } else {
      this.validateItems(list);
      this.showErrorMessage("Please fill in all fields before submitting");
    }
  };

  handleSurpressCorrespondence = () => {
    this.setState({
      surpressCorrespondence: !this.state.surpressCorrespondence
    });
  };

  addNoteToBluedogCase = noteText => {
    const note = {
      noteText,
      party: "System",
      rehabUser: "Mi3D",
      type: "Case Activity",
      direction: "Internal",
      createdBy: this.props.username,
      actionedBy: this.props.username,
      caseId: this.props.mi3dCase.caseId,
      bluedogCaseRef: this.props.bluedogCase.bluedogCaseRef
    };
    api.createCaseNote(note);
  };

  showErrorMessage = message => {
    this._isMounted &&
      this.setState({
        message,
        showLoader: false,
        showMessage: true,
        errorMessage: true,
        holdCaseSubmitted: false
      });
  };

  hideValidationMessage = () => {
    this._isMounted &&
      this.setState({
        message: "",
        showMessage: false,
        errorMessage: false
      });
  };

  goBackToCase = () => {
    this.props.history.push(
      `/cms/rehab/case/${this.props.mi3dCase.bluedogCaseRef}`
    );
  };

  closeModal = () => {
    this.setState({
      showLoader: false,
      additionalInfo: "",
      holdCaseSubmitted: false,
      selectedStopCaseReasonId: ""
    });
    this.props.closeModal();
  };

  render() {
    return (
      <Modal
        ariaHideApp={false}
        className="stop-case-modal"
        contentLabel="Stop Case Modal"
        isOpen={this.props.isModalOpen}
      >
        <div className="stop-case-modal__title">
          <h3 id="stopCaseModalTitle">{this.props.title}</h3>
        </div>
        <hr />
        <div className="stop-case-modal__body">
          {this.props.statement !== "" && (
            <FormRow>
              <FormGroup>
                <p
                  id="stopCaseModalStatement"
                  className="stop-case-modal__statement"
                >
                  "{this.props.statement}"
                </p>
              </FormGroup>
            </FormRow>
          )}
          <FormRow>
            <FormGroup>
              <Dropdown
                selection
                fullWidth
                placeholder="Select Reason.."
                name="selectedStopCaseReasonId"
                id="stopCaseReasonsModalDropdown"
                onChange={this.handleReasonChange}
                value={this.state.selectedStopCaseReasonId}
                options={this.state.stopCaseReasonsForDropdown}
                valid={this.validateItem("selectedStopCaseReasonId").toString()}
              />
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup flexBasis="100">
              <Form>
                <TextArea
                  name="additionalInfo"
                  onChange={this.handleChange}
                  value={this.state.additionalInfo}
                  placeholder="Additional Information..."
                  id="stopCaseReasonModalAdditionalInfoTextBox"
                />
              </Form>
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup>
              <Checkbox
                checked={this.state.surpressCorrespondence}
                onChange={this.handleSurpressCorrespondence}
                label="Surpress correspondence to instructing party"
              />
            </FormGroup>
          </FormRow>
        </div>
        <hr />
        <div className="stop-case-modal__footer">
          <ButtonContainer justifyContent="flex-end">
            <Message
              marginRight="25"
              id="stopCaseModalMessage"
              message={this.state.message}
              show={this.state.showMessage}
              error={this.state.errorMessage}
            />
            <div>
              <Button
                secondary
                content="Cancel"
                onClick={this.closeModal}
                disabled={this.state.holdCaseSubmitted}
              />
              <Button
                primary
                id="stopCaseBtn"
                onClick={this.handleValidation}
                content={this.props.buttonContent}
                disabled={this.state.holdCaseSubmitted}
                loading={this.state.holdCaseSubmitted}
              />
            </div>
          </ButtonContainer>
        </div>
      </Modal>
    );
  }
}
const mapStateToProps = state => ({
  username: state.auth.user.name,
  mi3dCase: state.case.mi3dCase,
  bluedogCase: state.case.selectedCase,
  bluedogCaseRef: state.case.selectedCase.bluedogCaseRef
});

const mapDispatchToProps = dispatch => ({
  updateMi3dCase: caseDetails => dispatch(updateMi3dCase(caseDetails))
});

export default withErrorHandling(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(StopCaseModal)
);
