import React, { Component } from "react";
import _ from "lodash";
import moment from "moment";
import * as api from "api";
import * as emailTemplates from "helpers/emailTemplates";
import * as systemActivities from "helpers/systemActivities";

import { withErrorHandling } from "HOCs";
import { addSystemActivity, updateSystemActivity } from "helpers/util";
import { createDischargeSurveyDocument } from "helpers/surveys";

import {
  emailInstructingParty,
  getBluedogInjuredPartyValues
} from "helpers/email";

import VAS from "..//VAS/VAS";
import PainKillers from "./PainKillers/PainKillers";
import CaseCompletion from "./CaseCompletion/CaseCompletion";
import PSFSActivities from "../PSFSActivities/PSFSActivities";
import CaseNotes from "components/CMS/Rehab/Case/CaseNotes/CaseNotes";
import StopCaseModal from "components/CMS/Rehab/StopCaseModal/StopCaseModal";
import UpdateCaseDetailsModal from "components/CMS/Rehab/UpdateCaseDetailsModal/UpdateCaseDetailsModal";
import { Row, Col } from "components/Common";
import SurveyCompleteModal from "../SurveyCompleteModal/SurveyCompleteModal";

class DischargeSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      painScores: [],
      modalTitle: "",
      showMessage: true,
      clinicianHCPC: "",
      errorMessage: true,
      closingSummary: "",
      modalStatement: "",
      stopCaseReason: "",
      modalReasonText: "",
      modalButtonText: "",
      otherPainKillers: "",
      initialPainScore: "",
      vasListToValidate: [],
      bluedogCaseValues: [],
      currentPainKillers: [],
      initialPainKillers: [],
      psfsListToValidate: [],
      invalidVASItems: false,
      invalidPSFSItems: false,
      stopCaseModalOpen: false,
      showVASValidation: false,
      showPSFSValidation: false,
      invalidPainKillers: false,
      completedDate: new Date(),
      injuredPartyCompliant: true,
      surveyCompletedModalOpen: false,
      showPainKillerValidation: false,
      injuredPartyResumedHobbies: true,
      injuredPartyReturnedToWork: true,
      showUpdateCaseDetailsModal: false,
      completedDischargeSurveyPainKillers: [],
      injuredPartyCompletedTreatmentPlan: true,
      clinicianSurveyQuestions:
        props.clinicianSurveyQuestions !== undefined
          ? props.clinicianSurveyQuestions
          : [],
      psfsActivities:
        props.psfsActivities !== undefined ? props.psfsActivities : []
    };

    this.addSystemActivity = addSystemActivity.bind(this);
    this.updateSystemActivity = updateSystemActivity.bind(this);
    this.emailInstructingParty = emailInstructingParty.bind(this);
    this.getBluedogInjuredPartyValues = getBluedogInjuredPartyValues.bind(this);
    this.createDischargeSurveyDocument = createDischargeSurveyDocument.bind(
      this
    );
  }

  componentDidMount() {
    this.getCompletedInitialSurvey();
    this.getCompletedClinicianSurvey();
    if (this.surveyComplete()) this.getCompletedDischargeSurvey();
    this.getBluedogInjuredPartyValues(this.props.bluedogCase);
  }

  surveyComplete = () => {
    return (
      this.props.completedDischargeSurvey !== null &&
      this.props.completedDischargeSurvey !== undefined
    );
  };

  handleInitialSurveyQuestions = initialSurveyQuestions => {
    if (initialSurveyQuestions !== undefined) {
      const painScoreQuestion = initialSurveyQuestions.find(
        q => q.type === "scale"
      );

      if (painScoreQuestion !== undefined)
        this.setState({ initialPainScore: painScoreQuestion.scaleAnswer });

      const returnedToWorkQuestion = initialSurveyQuestions.find(q =>
        q.questionText.includes("returned to work/school")
      );

      if (returnedToWorkQuestion !== undefined)
        this.setState({ returnedToWork: returnedToWorkQuestion.yesNoAnswer });
    }
  };

  parsePsfsActivities = () => {
    const parsedPsfsActivities = this.state.psfsActivities.map(activity => ({
      ...activity,
      currentPainScore: "",
      initialPainScore: activity.painScore
    }));
    this.setState({ psfsActivities: parsedPsfsActivities });
  };

  getCompletedClinicianSurvey = async () => {
    if (this.props.completedClinicianSurvey !== undefined) {
      const completedClinicianSurveyId = this.props.completedClinicianSurvey
        .completedClinicianSurveyId;

      const request = {
        completedSurveyId: completedClinicianSurveyId,
        actionedBy: this.props.username
      };

      const response = await api.getCompletedClinicianSurvey(request);

      if (response !== undefined) {
        this.setState(
          {
            wadScore: response.data.wadScore,
            clinicianSurveyQuestions: response.data.completedQuestions,
            psfsActivities: response.data.completedClinicianSurveyPsfsActivities
          },
          () => {
            this.parsePsfsActivities();
            this.getInitialPainKillers();
            this.getPainScores();
            this.getPatientOccupation();
          }
        );
      } else this.props.showErrorModal();
    }
  };

  getCompletedDischargeSurvey = async () => {
    const completedDischargeSurveyId = this.props.completedDischargeSurvey
      .completedDischargeSurveyId;

    const request = {
      completedSurveyId: completedDischargeSurveyId,
      actionedBy: this.props.username
    };

    const response = await api.getCompletedDischargeSurvey(request);

    if (response !== undefined) {
      this.setState({
        clinicianHCPC: response.data.clinicianHCPC,
        closingSummary: response.data.closingSummary,
        otherPainKillers: response.data.otherPainKillers,
        injuredPartyReturnedToWork: response.data.ipReturnedToWork,
        injuredPartyResumedHobbies: response.data.ipResumedHobbies,
        injuredPartyCompliant: response.data.contactWithIPEstablished,
        completedPainScores: response.data.completedDischargeSurveyVASScores,
        completedPainKillers: response.data.completedDischargeSurveyPainKillers,
        injuredPartyCompletedTreatmentPlan:
          response.data.ipCompletedTreatmentPlan,
        completedPsfsActivities:
          response.data.completedDischargeSurveyPSFSActivities
      });
    } else this.props.showErrorModal();
  };

  getCompletedInitialSurvey = async () => {
    const initialSurvey = this.props.mi3dCase.completedInitialSurvey;

    if (initialSurvey !== undefined) {
      const completedInitialSurveyId = initialSurvey.completedInitialSurveyId;

      const request = {
        completedSurveyId: completedInitialSurveyId,
        actionedBy: this.props.username
      };

      const response = await api.getCompletedInitialSurvey(request);

      if (response !== undefined) {
        this.handleInitialSurveyQuestions(response.data.completedQuestions);
      } else this.props.showErrorModal();
    }
  };

  getInitialPainKillers = () => {
    const { clinicianSurveyQuestions } = this.state;
    const painKillerQuestion = clinicianSurveyQuestions.find(q => {
      if (
        q.questionText ===
        "Are you taking any regular prescribed or non-prescribed medication, ie steroids or anti-coagulants?"
      )
        return q;
      return null;
    });

    if (painKillerQuestion !== undefined) {
      const initialPainKillers = {
        standardPainKillers: painKillerQuestion.selectionAnswers,
        other: painKillerQuestion.additionalInfo
      };

      this.setState({
        initialPainKillers
      });
    }
  };

  getPainScores = () => {
    const { clinicianSurveyQuestions } = this.state;
    const painScores = clinicianSurveyQuestions
      .filter(q => q.scaleAnswer !== 0)
      .map(question => ({
        currentPainScore: "",
        initialPainScore: question.scaleAnswer,
        bodyPart: this.parseQuestionGroupId(question.questionGroupId)
      }));
    this.setState({ painScores: _.orderBy(painScores, ["bodyPart"]) });
  };

  getCurrentPainScores = currentPainScore => {
    const painScoreToUpdate = this.state.painScores.find(
      m => m.bodyPart === currentPainScore.bodyPart
    );
    painScoreToUpdate.currentPainScore = currentPainScore.painScore;

    const updatedPainScores = this.state.painScores
      .filter(m => m.bodyPart !== currentPainScore.bodyPart)
      .concat(painScoreToUpdate);
    this.setState({
      showVASValidation: false,
      painScores: _.orderBy(updatedPainScores, ["bodyPart"])
    });
  };

  getCurrentPsfsPainScores = currentPainScore => {
    const psfsActivityToUpdate = this.state.psfsActivities.find(
      m => m.activity === currentPainScore.activity
    );
    psfsActivityToUpdate.currentPainScore = currentPainScore.painScore;

    const updatedPsfsActivities = this.state.psfsActivities
      .filter(m => m.activity !== currentPainScore.activity)
      .concat(psfsActivityToUpdate);

    this.setState({
      psfsActivities: _.orderBy(updatedPsfsActivities, ["activity"]),
      showPSFSValidation: false
    });
  };

  parseQuestionGroupId = questionGroupId => {
    const bodyPart = questionGroupId.lastIndexOf("_");
    let parsedBodyPart = questionGroupId.substring(bodyPart + 1);
    parsedBodyPart = parsedBodyPart.replace(/([A-Z])/g, " $1").trim();
    return parsedBodyPart;
  };

  checkIfVASIsValid = () => {
    const incompletePainScores = this.state.painScores.filter(
      m => m.currentPainScore === ""
    );
    const vasListToValidate = incompletePainScores.map(painScore => ({
      [painScore.bodyPart]: ""
    }));
    if (
      incompletePainScores.length > 0 &&
      this.state.injuredPartyCompletedTreatmentPlan
    ) {
      this.setState({
        vasListToValidate,
        invalidVASItems: true,
        showVASValidation: true
      });
    } else {
      this.setState({ showVASValidation: false });
    }
  };

  checkIfPSFSIsValid = () => {
    const incompletePsfsActivities = this.state.psfsActivities.filter(
      m => m.currentPainScore === ""
    );
    const psfsListToValidate = incompletePsfsActivities.map(activity => ({
      [activity.activity]: ""
    }));
    if (
      incompletePsfsActivities.length > 0 &&
      this.state.injuredPartyCompletedTreatmentPlan
    ) {
      this.setState({
        psfsListToValidate,
        invalidPSFSItems: true,
        showPSFSValidation: true
      });
    } else {
      this.setState({
        showPSFSValidation: false
      });
    }
  };

  checkIfPainKillersValid = () => {
    const painKillersSelected = this.state.currentPainKillers.length > 0;
    if (this.state.injuredPartyCompletedTreatmentPlan) {
      if (!painKillersSelected)
        this.setState({
          showPainKillerValidation: true
        });
    } else
      this.setState({
        showPainKillerValidation: false
      });
  };

  getClosingSummary = closingSummary => {
    this.setState({ closingSummary });
  };

  getSelectedPainKillers = selectedPainKillers => {
    this.setState({
      invalidPainKillers: false,
      showPainKillerValidation: false,
      currentPainKillers: selectedPainKillers
    });
  };

  getOtherPainKillers = otherPainKillers => {
    this.setState({ otherPainKillers });
  };

  getInjuredPartyCompliant = compliance => {
    this.setState({
      showVASValidation: false,
      showPSFSValidation: false,
      showPainKillerValidation: false,
      injuredPartyCompliant: compliance === "Yes" ? true : false
    });
  };

  getInjuredPartyResumedHobbies = resumed => {
    this.setState({
      injuredPartyResumedHobbies: resumed === "Yes" ? true : false
    });
  };

  getInjuredPartyReturnedToWork = returnedToWork => {
    this.setState({
      injuredPartyReturnedToWork: returnedToWork === "Yes" ? true : false
    });
  };

  getInjuredPartyCompletedTreatmentPlan = completedTreatmentPlan => {
    this.setState({
      showVASValidation: false,
      showPSFSValidation: false,
      showPainKillerValidation: false,
      injuredPartyCompletedTreatmentPlan:
        completedTreatmentPlan === "Yes" ? true : false
    });
  };

  getPatientOccupation = () => {
    const { clinicianSurveyQuestions } = this.state;
    const patientOccupation = clinicianSurveyQuestions.find(q => {
      if (q.questionText === "What is your occupation?") return q;
    });
    if (patientOccupation !== undefined) {
      this.setState({ patientOccupation: patientOccupation.textAnswer });
    }
  };

  getCurrentPainScore = () => {
    const { painScores } = this.state;
    if (painScores.length > 0 && painScores[0].currentPainScore !== "") {
      return painScores[0].currentPainScore;
    }
    return 0;
  };

  getClinicianHCPC = clinicianHCPC => {
    this.setState({ clinicianHCPC });
  };

  checkIfPainKillersCurrentlyBeingTaken = () => {
    const { currentPainKillers } = this.state;
    if (currentPainKillers.length > 0 && currentPainKillers[0] !== "None")
      return "Yes";
    return "No";
  };

  checkIfPainKillersInitiallyBeingTaken = () => {
    const { initialPainKillers } = this.state;
    if (
      initialPainKillers.standardPainKillers !== undefined ||
      initialPainKillers.other !== ""
    ) {
      if (
        initialPainKillers.standardPainKillers.length > 0 ||
        initialPainKillers.other !== ""
      )
        return "Yes";
      return "No";
    }
    return "No";
  };

  validateDischargeSurvey = () => {
    const incompletePainScores = this.state.painScores.filter(
      m => m.currentPainScore === ""
    );

    const incompletePSFSActivities = this.state.psfsActivities.filter(
      m => m.currentPainScore === ""
    );

    const completedDischargeSurveyPainKillers = this.state.currentPainKillers.map(
      painKiller => ({
        name: painKiller
      })
    );
    if (this.state.injuredPartyCompliant) {
      if (
        incompletePainScores.length === 0 &&
        incompletePSFSActivities.length === 0 &&
        completedDischargeSurveyPainKillers.length > 0
      ) {
        this.submitDischargeSurvey(completedDischargeSurveyPainKillers);
      }
    } else {
      this.submitDischargeSurvey(completedDischargeSurveyPainKillers);
    }
  };

  compliantDischargeSurvey = () => {
    const completedDischargeSurveyPainKillers = this.state.currentPainKillers.map(
      painKiller => ({
        name: painKiller
      })
    );
    return {
      type: "Discharge",
      actionedBy: this.props.username,
      completedBy: this.props.username,
      caseId: this.props.mi3dCase.caseId,
      completedDischargeSurveyPainKillers,
      completedDate: this.state.completedDate,
      clinicianHCPC: this.state.clinicianHCPC,
      closingSummary: this.state.closingSummary,
      otherPainKillers: this.state.otherPainKillers,
      ipDoesNotWork: this.state.returnedToWork === "N/A",
      ipResumedHobbies: this.state.injuredPartyResumedHobbies,
      completedDischargeSurveyVASScores: this.state.painScores,
      completedDischargeSurveyPSFSActivities: this.state.psfsActivities,
      contactWithIPEstablished: this.state.injuredPartyCompliant ? true : false,
      ipCompletedTreatmentPlan: this.state.injuredPartyCompletedTreatmentPlan,
      ipReturnedToWork:
        this.state.returnedToWork === "N/A"
          ? false
          : this.state.injuredPartyReturnedToWork
    };
  };

  nonCompliantDischargeSurvey = () => ({
    type: "Discharge",
    actionedBy: this.props.username,
    completedBy: this.props.username,
    caseId: this.props.mi3dCase.caseId,
    clinicianHCPC: this.state.clinicianHCPC,
    completedDate: this.state.completedDate,
    closingSummary: this.state.closingSummary,
    contactWithIPEstablished:
      this.state.injuredPartyCompliant === "Yes" ? true : false
  });

  closeBluedogCase = async () => {
    const systemActivityId = await this.addSystemActivity(
      "Update Internal Case ",
      "Case",
      "Pending",
      null,
      "closeBluedogCase150Fee"
    );

    const response = await api.closeBluedogCase150Fee(
      this.props.bluedogCase.bluedogCaseRef
    );

    if (response.status === 200)
      await this.updateSystemActivity(systemActivityId, "Success");
    else await this.updateSystemActivity(systemActivityId, "Error");
  };

  handleSaveSurvey = async () => {
    let surveySaved;

    if (this.state.injuredPartyCompliant) {
      surveySaved = await api.saveCompletedDischargeSurvey(
        this.compliantDischargeSurvey()
      );
    } else {
      surveySaved = await api.saveCompletedDischargeSurvey(
        this.nonCompliantDischargeSurvey()
      );
    }

    return surveySaved;
  };

  handleDischargeSurveyDocument = async () => {
    const { completedDate } = this.state;

    const systemActivityId = await this.addSystemActivity(
      "Create Discharge Survey Document",
      "Document",
      "Pending"
    );

    const dischargeSurveyDetails = this.dischargeSurveyForDocumentBuilder();
    let dischargeSurveyDocument = await this.createDischargeSurveyDocument(
      dischargeSurveyDetails,
      completedDate
    );

    if (dischargeSurveyDocument !== null) {
      await this.updateSystemActivity(systemActivityId, "Success");
      return dischargeSurveyDocument;
    } else {
      await this.updateSystemActivity(systemActivityId, "Error");
      return null;
    }
  };

  submitDischargeSurveyWhenKnockedOut = async () => {
    const surveySavedResponse = await this.handleSaveSurvey();

    if (surveySavedResponse !== undefined) {
      if (surveySavedResponse.status === 200) {
        this.props.updateMi3dCase(surveySavedResponse.data);

        const dischargeSurveyDocument = await this.handleDischargeSurveyDocument();

        if (dischargeSurveyDocument !== null) {
          this.goBackToCase();
          return dischargeSurveyDocument;
        } else
          this.showErrorMessage("Could not create Discharge Survey document");
      } else this.showErrorMessage(surveySavedResponse.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  submitDischargeSurvey = async () => {
    const surveySavedResponse = await this.handleSaveSurvey();

    if (surveySavedResponse !== undefined) {
      if (surveySavedResponse.status === 200) {
        this.props.updateMi3dCase(surveySavedResponse.data);

        const dischargeSurveyDocument = await this.handleDischargeSurveyDocument();

        if (dischargeSurveyDocument !== null) {
          await this.closeBluedogCase();
          this.goBackToCase();
          return dischargeSurveyDocument;
        } else
          this.showErrorMessage("Could not create Discharge Survey document");
      } else this.showErrorMessage(surveySavedResponse.data[0].errorMessage);
    } else this.props.showErrorModal();
  };

  goBackToCase = () => {
    this.props.history.push(
      `/cms/rehab/case/${this.props.bluedogCase.bluedogCaseRef}`
    );
  };

  dischargeSurveyForDocumentBuilder = () => {
    const { mi3dCase, username } = this.props;
    const { bluedogCaseValues } = this.state;
    return {
      ...bluedogCaseValues,
      clinicianName: username,
      completedDate: this.state.completedDate,
      clinicianHCPC: this.state.clinicianHCPC,
      psfsActivities: this.state.psfsActivities,
      closingSummary: this.state.closingSummary,
      compliant: this.state.injuredPartyCompliant,
      currentPainScore: this.getCurrentPainScore(),
      initialPainScore: this.state.initialPainScore,
      ipDoesNotWork: this.state.returnedToWork === "N/A",
      injuredPartyOccupation: this.state.patientOccupation,
      hasResumedHobbies: this.state.injuredPartyResumedHobbies,
      hasReturnedToWork: this.state.injuredPartyReturnedToWork,
      numberOfPrescribedExercises: mi3dCase.numberOfPrescribedExercises,
      completedTreatmentPlan: this.state.injuredPartyCompletedTreatmentPlan,
      painKillersInitiallyBeingTaken: this.checkIfPainKillersInitiallyBeingTaken(),
      painKillersCurrentlyBeingTaken: this.checkIfPainKillersCurrentlyBeingTaken(),
      clinicianSurveyDate: moment(
        mi3dCase.completedClinicianSurvey.completedDate
      ).format("DD/MM/YYYY"),
      registerationDate: moment(mi3dCase.exerciseStartDate).format(
        "DD/MM/YYYY"
      ),
      soapCallDate:
        mi3dCase.completedSOAPSurveys.length > 0
          ? moment(mi3dCase.completedSOAPSurveys[0].completedDate).format(
              "DD/MM/YYYY"
            )
          : "Did not complete"
    };
  };

  getCase = async caseId => {
    const response = await api.getCase(caseId);
    if (response !== undefined) {
      this.props.updateMi3dCase(response.data);
    } else this.props.showErrorModal();
  };

  extendCourseDuration = () => {
    this.setState({ showUpdateCaseDetailsModal: true });
  };

  furtherTreatmentAlreadyAdded = () => {
    const { mi3dCase } = this.props;
    const furtherTreatmentChase = mi3dCase.chases.find(
      m => m.name === "DischargeSurveyFurtherTreatmentChase"
    );
    return furtherTreatmentChase !== undefined ? true : false;
  };

  showErrorMessage = message => {
    this.setState({
      message,
      errorMessage: true,
      showMessage: true
    });
  };

  returnCompletedDate = completedDate => {
    this.setState({ completedDate });
  };

  completeSurvey = async () => {
    this.submitDischargeSurvey();
    this.props.history.push(
      `/cms/rehab/case/${this.props.bluedogCase.bluedogCaseRef}`
    );
  };

  showSurveyCompleteModal = () => {
    this.setState({ surveyCompletedModalOpen: true });
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

  render() {
    const {
      painScores,
      clinicianHCPC,
      closingSummary,
      psfsActivities,
      returnedToWork,
      invalidVASItems,
      invalidPSFSItems,
      otherPainKillers,
      showVASValidation,
      vasListToValidate,
      showPSFSValidation,
      invalidPainKillers,
      currentPainKillers,
      psfsListToValidate,
      initialPainKillers,
      completedPainScores,
      completedPainKillers,
      injuredPartyCompliant,
      completedPsfsActivities,
      showPainKillerValidation,
      injuredPartyResumedHobbies,
      injuredPartyReturnedToWork,
      injuredPartyCompletedTreatmentPlan
    } = this.state;
    return (
      <Row id="dischargeSurvey" className="discharge-survey">
        <Col lg={6} sm={12}>
          <Row>
            <Col sm={12}>
              <VAS
                id="dischargeSurveyVAS"
                painScores={painScores}
                vasListToValidate={vasListToValidate}
                surveyComplete={this.surveyComplete()}
                completedPainScores={completedPainScores}
                showValidationWarning={showVASValidation}
                getCurrentPainScore={this.getCurrentPainScores}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <PSFSActivities
                psfsActivities={psfsActivities}
                id="dischargeSurveyPSFSActivities"
                surveyComplete={this.surveyComplete()}
                psfsListToValidate={psfsListToValidate}
                showValidationWarning={showPSFSValidation}
                completedPsfsActivities={completedPsfsActivities}
                getCurrentPsfsPainScores={this.getCurrentPsfsPainScores}
              />
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <PainKillers
                id="dischargeSurveyPainKillers"
                surveyComplete={this.surveyComplete()}
                currentPainKillers={currentPainKillers}
                initialPainKillers={initialPainKillers}
                completedPainKillers={completedPainKillers}
                valid={invalidPainKillers ? "false" : "true"}
                returnOtherPainKillers={this.getOtherPainKillers}
                showValidationWarning={showPainKillerValidation}
                returnSelectedPainKillers={this.getSelectedPainKillers}
                otherPainKillers={
                  otherPainKillers !== null ? otherPainKillers : ""
                }
              />
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <CaseNotes
                mi3dCase={this.props.mi3dCase}
                username={this.props.username}
                bluedogCase={this.props.bluedogCase}
                updateMi3dCase={this.props.updateMi3dCase}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={6} sm={12}>
          <Row>
            <Col sm={12}>
              <CaseCompletion
                id="dischargeSurveyCaseCompletion"
                clinicianHCPC={clinicianHCPC}
                returnedToWork={returnedToWork}
                closingSummary={closingSummary}
                invalidVASItems={invalidVASItems}
                invalidPSFSItems={invalidPSFSItems}
                surveyComplete={this.surveyComplete()}
                invalidPainKillers={invalidPainKillers}
                checkIfVASIsValid={this.checkIfVASIsValid}
                returnClinicianHCPC={this.getClinicianHCPC}
                checkIfPSFSIsValid={this.checkIfPSFSIsValid}
                returnClosingSummary={this.getClosingSummary}
                injuredPartyCompliant={injuredPartyCompliant}
                extendCourseDuration={this.extendCourseDuration}
                handleOpenStopCaseModal={this.handleOpenStopCaseModal}
                showSurveyCompleteModal={this.showSurveyCompleteModal}
                checkIfPainKillersValid={this.checkIfPainKillersValid}
                injuredPartyResumedHobbies={injuredPartyResumedHobbies}
                injuredPartyReturnedToWork={injuredPartyReturnedToWork}
                returnInjuredPartyCompliant={this.getInjuredPartyCompliant}
                furtherTreatmentAlreadyAdded={this.furtherTreatmentAlreadyAdded}
                injuredPartyCompletedTreatmentPlan={
                  injuredPartyCompletedTreatmentPlan
                }
                returnInjuredPartyResumedHobbies={
                  this.getInjuredPartyResumedHobbies
                }
                returnInjuredPartyReturnedToWork={
                  this.getInjuredPartyReturnedToWork
                }
                returnInjuredPartyCompletedTreatmentPlan={
                  this.getInjuredPartyCompletedTreatmentPlan
                }
              />
            </Col>
          </Row>
        </Col>
        <UpdateCaseDetailsModal
          chaseType="Discharge"
          id="updateCaseDetailsModal"
          mi3dCase={this.props.mi3dCase}
          username={this.props.username}
          furtherTreatmentChaseNeeded={true}
          bluedogCase={this.props.bluedogCase}
          goBackToCase={this.props.goBackToCase}
          salasoId={this.props.mi3dCase.salasoId}
          updateMi3dCase={this.props.updateMi3dCase}
          isModalOpen={this.state.showUpdateCaseDetailsModal}
          courseDuration={this.props.mi3dCase.courseDurationInWeeks}
          cancel={() => this.setState({ showUpdateCaseDetailsModal: false })}
          numberOfPrescribedExercises={
            this.props.mi3dCase.numberOfPrescribedExercises
          }
          closeModal={() =>
            this.setState({ showUpdateCaseDetailsModal: false })
          }
        />
        <SurveyCompleteModal
          isModalOpen={this.state.surveyCompletedModalOpen}
          closeModal={() => this.setState({ surveyCompletedModalOpen: false })}
          returnCompletedDate={this.returnCompletedDate}
          completeSurvey={this.completeSurvey}
        />

        <StopCaseModal
          id="stopCaseModal"
          dischargeSurvey={true}
          history={this.props.history}
          title={this.state.modalTitle}
          username={this.props.username}
          bluedogCase={this.props.bluedogCase}
          statement={this.state.modalStatement}
          isModalOpen={this.state.stopCaseModalOpen}
          stopCaseReason={this.state.stopCaseReason}
          buttonContent={this.state.modalButtonText}
          saveCompletedDischargeSurvey={this.submitDischargeSurvey}
          closeModal={() => this.setState({ stopCaseModalOpen: false })}
          saveCompletedDischargeSurveyWhenKnockedOut={
            this.submitDischargeSurveyWhenKnockedOut
          }
        />
      </Row>
    );
  }
}

export default withErrorHandling(DischargeSurvey);
