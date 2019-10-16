import React, { Component } from "react";
import * as api from "api";
import { connect } from "react-redux";

import * as emailTemplates from "helpers/emailTemplates";
import * as systemActivities from "helpers/systemActivities";

import { withErrorHandling, withCaseLocking } from "HOCs";

import { addSystemActivity, updateSystemActivity } from "helpers/util";

import {
  updateMi3dCase,
  updateBluedogCase,
  selectSecondaryItem
} from "actions";

import {
  emailInstructingParty,
  getBluedogInjuredPartyValues
} from "helpers/email";

import CourseDurationForm from "./CourseDurationForm";
import DPAModal from "components/CMS/Rehab/DPAModal/DPAModal";
import CompletedSurveyContent from "./CompletedSurveyContent";
import PageTopBar from "components/CMS/Rehab/PageTopBar/PageTopBar";
import CaseNotes from "components/CMS/Rehab/Case/CaseNotes/CaseNotes";
import StopCaseModal from "components/CMS/Rehab/StopCaseModal/StopCaseModal";
import CaseLockedModal from "components/CMS/Rehab/Case/CaseLockedModal/CaseLockedModal";
import InjuredPartyContactDetails from "components/CMS/Rehab/Case/InjuredPartyContactDetails/InjuredPartyContactDetails";

import { Container, Row, Col } from "components/Common";

import {
  validateItem,
  validateItems,
  setItemToValidate,
  validateListOfStrings,
  removeValidationErrors
} from "helpers/validation";

import "./CompletedSurvey.scss";

class CompletedSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      salasoId: "",
      modalTitle: "",
      courseDuration: "",
      modalStatement: "",
      stopCaseReason: "",
      modalReasonText: "",
      modalButtonText: "",
      showMessage: false,
      dpaModalOpen: false,
      errorMessage: false,
      bluedogCaseValues: [],
      surveyCompleted: false,
      prescribedExercises: "",
      stopCaseModalOpen: false,
      surpressCorrespondence: false
    };

    this.validateItem = validateItem.bind(this);
    this.validateItems = validateItems.bind(this);
    this.setItemToValidate = setItemToValidate.bind(this);
    this.removeValidationErrors = removeValidationErrors.bind(this);
    this.getBluedogInjuredPartyValues = getBluedogInjuredPartyValues.bind(this);
    this.addSystemActivity = addSystemActivity.bind(this);
    this.updateSystemActivity = updateSystemActivity.bind(this);
    this.emailInstructingParty = emailInstructingParty.bind(this);
  }

  componentDidMount() {
    this._mounted = true;
    window.scrollTo(0, 0);
    this.getBluedogInjuredPartyValues(this.props.bluedogCase);
  }

  async componentWillUnmount() {
    this._mounted = false;
  }

  handleChange = (e, { name, value }) => {
    this.setItemToValidate(name);
    this.setState({ [name]: value });
  };

  listToValidate = () => {
    return [
      { salasoId: this.state.salasoId },
      { courseDuration: this.state.courseDuration },
      { prescribedExercises: this.state.prescribedExercises }
    ];
  };

  initialSurveyDocument = () => {
    const { mi3dCase } = this.props;
    const initialSurveyDocument = mi3dCase.caseDocuments.find(
      m => m.name === "Initial Survey"
    );

    if (initialSurveyDocument !== undefined) return initialSurveyDocument.path;
  };

  completeSurvey = async () => {
    try {
      const { bluedogCaseValues } = this.state;

      var list = validateListOfStrings(this.listToValidate());

      const emailTemplateName = emailTemplates.emailInsPCaseEligibleForMi3D;
      const activity = systemActivities.emailInsPCaseEligibleForMi3D;

      if (list[list.length - 1].isValid) {
        this.setCourseDetails();
        this.setState({ surveyCompleted: true, showMessage: false });

        if (!this.state.surpressCorrespondence) {
          const systemActivity = {
            activity,
            type: "Email",
            state: "Pending",
            emailTemplateName,
            bluedogActionName: null,
            surveyDocumentNeedsSending: true,
            sendTo: "Instructing Party"
          };
          await this.emailInstructingParty(
            systemActivity,
            emailTemplateName,
            bluedogCaseValues,
            this.initialSurveyDocument()
          );
        }
      } else {
        this.validateItems(list);
        this.showErrorMessage(
          "Please fill in all the fields before submitting"
        );
      }
    } catch {
      this.props.showErrorModal();
    }
  };

  courseDetails = () => ({
    salasoId: parseInt(this.state.salasoId),
    actionedBy: this.props.username,
    caseId: this.props.mi3dCase.caseId,
    courseDurationInWeeks: parseInt(this.state.courseDuration),
    numberOfPrescribedExercises: parseInt(this.state.prescribedExercises)
  });

  firstChase = () => ({
    actionedBy: this.props.username,
    caseId: this.props.mi3dCase.caseId,
    name: "PostClinicalAssessmentChaseOne"
  });

  goToCase = () => {
    this.props.history.push(
      `/cms/rehab/case/${this.props.mi3dCase.bluedogCaseRef}`
    );
  };

  setCourseDetails = async () => {
    const response = await api.setCourseDetails(this.courseDetails());
    if (response !== undefined) {
      if (response.status === 200) {
        this.props.updateMi3dCase(response.data);
        const chaseTriggered = await this.triggerFirstChase();
        if (chaseTriggered) this.goToCase();
      } else {
        this.showErrorMessage(response.data[0].errorMessage);
        this.setState({ surveyCompleted: false });
      }
    } else this.props.showErrorModal();
  };

  triggerFirstChase = async () => {
    const response = await api.createFirstChase(this.firstChase());
    if (response !== undefined) {
      if (response.status === 200) {
        this.props.updateMi3dCase(response.data);
        return true;
      } else {
        this.showErrorMessage(response.data[0].errorMessage);
        this.setState({ surveyCompleted: false });
        return false;
      }
    } else this.props.showErrorModal();
  };

  showErrorMessage = message => {
    this._mounted &&
      this.setState({
        message,
        showMessage: true,
        errorMessage: true
      });
  };

  hideErrorMessage = () => {
    this._mounted &&
      this.setState({
        message: "",
        showMessage: false,
        errorMessage: false
      });
  };

  handleSurpressCorrespondence = () => {
    this.setState({
      surpressCorrespondence: !this.state.surpressCorrespondence
    });
  };

  handleOpenStopCaseModal = (
    modalTitle,
    modalButtonText,
    modalStatement,
    stopCaseReason = ""
  ) => {
    this.setState({
      modalTitle,
      modalStatement,
      stopCaseReason,
      modalButtonText,
      stopCaseModalOpen: true
    });
  };

  surpressCorrespondence = () => {
    return this.state.surpressCorrespondence;
  };

  openStopCaseModal = () => {
    this.setState({
      stopCaseModalOpen: true,
      modalButtonText: "Stop Case",
      modalTitle: "Reason for stopping the case",
      modalReasonText: "Reason for putting the case on hold:"
    });
  };

  goBackToCaseList = () => {
    this.props.history.push("/cms/rehab/cases");
  };

  render() {
    return (
      <Container fluid>
        <PageTopBar
          title="Clinician Survey Complete"
          openHoldModal={this.openStopCaseModal}
          openDpaModal={() => this.setState({ dpaModalOpen: true })}
          caseClosed={this.props.mi3dCase.caseClosed}
        />
        <Row>
          <Col lg={6} md={12} sm={12}>
            <Row>
              <Col lg={12}>
                <CompletedSurveyContent />
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <CaseNotes
                  mi3dCase={this.props.mi3dCase}
                  username={this.props.username}
                  bluedogCase={this.props.bluedogCase}
                  updateMi3dCase={this.props.updateMi3dCase}
                />
              </Col>
            </Row>
          </Col>
          <Col lg={6} md={12} sm={12}>
            <Row>
              <Col lg={12}>
                <InjuredPartyContactDetails
                  mi3dCase={this.props.mi3dCase}
                  username={this.props.username}
                  bluedogCase={this.props.bluedogCase}
                  updateMi3dCase={this.props.updateMi3dCase}
                  updateBluedogCase={this.props.updateBluedogCase}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <CourseDurationForm
                  message={this.state.message}
                  salasoId={this.state.salasoId}
                  handleChange={this.handleChange}
                  validateItem={this.validateItem}
                  completeSurvey={this.completeSurvey}
                  showMessage={this.state.showMessage}
                  errorMessage={this.state.errorMessage}
                  courseDuration={this.state.courseDuration}
                  surveyCompleted={this.state.surveyCompleted}
                  prescribedExercises={this.state.prescribedExercises}
                  handleOpenStopCaseModal={this.handleOpenStopCaseModal}
                  surpressCorrespondence={this.state.surpressCorrespondence}
                  handleSurpressCorrespondence={
                    this.handleSurpressCorrespondence
                  }
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <DPAModal
          mi3dCase={this.props.mi3dCase}
          username={this.props.username}
          bluedogCase={this.props.bluedogCase}
          isModalOpen={this.state.dpaModalOpen}
          updateMi3dCase={this.props.updateMi3dCase}
          updateBluedogCase={this.props.updateBluedogCase}
          closeModal={() => this.setState({ dpaModalOpen: false })}
        />

        <StopCaseModal
          id="stopCaseModal"
          history={this.props.history}
          title={this.state.modalTitle}
          username={this.props.username}
          completedClinicianSurvey={true}
          bluedogCase={this.props.bluedogCase}
          statement={this.state.modalStatement}
          isModalOpen={this.state.stopCaseModalOpen}
          stopCaseReason={this.state.stopCaseReason}
          buttonContent={this.state.modalButtonText}
          closeModal={() => this.setState({ stopCaseModalOpen: false })}
          initialSurveyDocument={this.initialSurveyDocument()}
        />

        <CaseLockedModal
          id="caseLockedModal"
          lockedBy={this.props.mi3dCase.lockedBy}
          goBackToCaseList={this.goBackToCaseList}
          isModalOpen={this.state.caseLockedModalOpen}
          closeModal={() => this.setState({ caseLockedModalOpen: false })}
        />
      </Container>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  updateMi3dCase: updatedCase => dispatch(updateMi3dCase(updatedCase)),
  selectSecondaryItem: menuItem => dispatch(selectSecondaryItem(menuItem)),
  updateBluedogCase: updatedCase => dispatch(updateBluedogCase(updatedCase))
});

const mapStateToProps = state => ({
  mi3dCase: state.case.mi3dCase,
  username: state.auth.user.name,
  bluedogCase: state.case.selectedCase
});

export default withErrorHandling(
  withCaseLocking(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(CompletedSurvey)
  )
);
