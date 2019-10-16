import React, { Component } from "react";
import _ from "lodash";
import * as api from "api";

import { getBluedogInjuredPartyValues } from "helpers/email";
import { addSystemActivity, updateSystemActivity } from "helpers/util";
import { createSOAPSurveyDocument } from "helpers/surveys";

import {withErrorHandling} from "HOCs";

import VAS from "../VAS/VAS";
import SOAPForm from "./SOAPForm/SOAPForm";
import PainKillers from "./PainKillers/PainKillers";
import PSFSActivities from "../PSFSActivities/PSFSActivities";
import CaseNotes from "components/CMS/Rehab/Case/CaseNotes/CaseNotes";
import UpdateCaseDetailsModal from "components/CMS/Rehab/UpdateCaseDetailsModal/UpdateCaseDetailsModal";
import { Row, Col } from "components/Common";
import SurveyCompleteModal from "../SurveyCompleteModal/SurveyCompleteModal";

class SOAPSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      soapForm: null,
      painScores: [],
      showMessage: true,
      errorMessage: true,
      vasListToValidate: [],
      bluedogCaseValues: [],
      currentPainKillers: [],
      psfsListToValidate: [],
      invalidVASItems: false,
      invalidPSFSItems: false,
      completedPainScores: [],
      showVASValidation: false,
      completedDate: new Date(),
      showPSFSValidation: false,
      futherTreatmentAdded: false,
      completedPsfsActivities: [],
      removeValidationWarning: false,
      surveyCompletedModalOpen: false,
      showUpdateCaseDetailsModal: false,
      clinicianSurveyQuestions:
        props.clinicianSurveyQuestions !== undefined
          ? props.clinicianSurveyQuestions
          : [],
      psfsActivities:
        props.psfsActivities !== undefined ? props.psfsActivities : []
    };

    this.getBluedogInjuredPartyValues = getBluedogInjuredPartyValues.bind(this);
    this.addSystemActivity = addSystemActivity.bind(this);
    this.updateSystemActivity = updateSystemActivity.bind(this);
    this.createSOAPSurveyDocument = createSOAPSurveyDocument.bind(this);
  }

  componentDidMount() {
    this.getBluedogInjuredPartyValues(this.props.bluedogCase);
    this.getCompletedClinicianSurvey();
  }

  getCompletedClinicianSurvey = async () => {
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
          this.getCurrentPainKillers();
          this.getPainScores();
        }
      );
    } else this.props.showErrorModal();
  };

  parsePsfsActivities = () => {
    const parsedPsfsActivities = this.state.psfsActivities.map(activity => ({
      ...activity,
      currentPainScore: "",
      initialPainScore: activity.painScore
    }));
    this.setState({ psfsActivities: parsedPsfsActivities });
  };

  getCurrentPainKillers = () => {
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
      const currentPainKillers = {
        other: painKillerQuestion.additionalInfo,
        standardPainKillers: painKillerQuestion.selectionAnswers
      };
      this.setState({
        currentPainKillers
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
    this.setState({ removeValidationWarning: true });
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
    this.setState({ removeValidationWarning: true });
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

  soapSurveyToSubmit = soapForm => ({
    ...soapForm,
    type: "SOAP",
    completedDate: this.state.completedDate,
    completedSOAPSurveyVASScores: this.state.painScores,
    completedSOAPSurveyPSFSActivities: this.state.psfsActivities,
    furtherTreatmentChaseNeedsCompleting: this.furtherTreatmentChaseNeedsCompleting()
  });

  surveyValid = () => {
    const { painScores, psfsActivities } = this.state;

    const incompletePainScores = painScores.filter(
      m => m.currentPainScore === ""
    );

    const incompletePSFSActivities = psfsActivities.filter(
      m => m.currentPainScore === ""
    );
    return (
      incompletePainScores.length === 0 && incompletePSFSActivities.length === 0
    );
  };

  submitSoapSurvey = async soapForm => {
    const { bluedogCaseValues, completedDate } = this.state;
    const { mi3dCase } = this.props;
    let currentSOAPSurveys = mi3dCase.completedSOAPSurveys.length;
    if (this.surveyValid()) {
      const response = await api.saveCompletedSOAPSurvey(
        this.soapSurveyToSubmit(soapForm)
      );

      if (response !== undefined) {
        if (response.status === 200) {
          this.props.updateMi3dCase(response.data);
          const systemActivityId = await this.addSystemActivity(
            `Create SOAP Survey Document ${++currentSOAPSurveys}`,
            "Document",
            "Pending"
          );
          const surveyCreated = await this.createSOAPSurveyDocument(
            soapForm,
            bluedogCaseValues,
            completedDate
          );
          if (surveyCreated !== "") {
            await this.updateSystemActivity(systemActivityId, "Success");
          } else await this.updateSystemActivity(systemActivityId, "Error");
        } else {
          this.setState({
            showMessage: true,
            errorMessage: true,
            message: response.data[0].errorMessage
          });
        }
      }
    }
  };

  getCase = async caseId => {
    const response = await api.getCase(caseId);
    if (response !== undefined) {
      this.props.updateMi3dCase(response.data);
    } else this.props.showErrorModal();
  };

  checkIfVASIsValid = () => {
    const incompletePainScores = this.state.painScores.filter(
      m => m.currentPainScore === ""
    );
    const vasListToValidate = incompletePainScores.map(painScore => ({
      [painScore.bodyPart]: ""
    }));
    if (incompletePainScores.length > 0) {
      this.setState({
        vasListToValidate,
        invalidVASItems: true,
        showVASValidation: true
      });
      return false;
    } else {
      this.setState({ invalidVASItems: false, showVASValidation: false });
      return true;
    }
  };

  checkIfPSFSIsValid = () => {
    const incompletePsfsActivities = this.state.psfsActivities.filter(
      m => m.currentPainScore === ""
    );
    const psfsListToValidate = incompletePsfsActivities.map(activity => ({
      [activity.activity]: ""
    }));
    if (incompletePsfsActivities.length > 0) {
      this.setState({
        psfsListToValidate,
        invalidPSFSItems: true,
        showPSFSValidation: true
      });
      return false;
    } else {
      this.setState({
        invalidPSFSItems: false,
        showPSFSValidation: false
      });
      return true;
    }
  };

  initialSOAPCallAlreadyCompleted = () => {
    const { mi3dCase } = this.props;
    const soapSurveyAlreadyCompleted = mi3dCase.completedSOAPSurveys.length > 0;
    return soapSurveyAlreadyCompleted;
  };

  furtherTreatmentChaseNeedsCompleting = () => {
    const { mi3dCase } = this.props;
    const furtherTreatmentChase = mi3dCase.chases.find(
      m => m.name === "SOAPSurveyFurtherTreatmentChase"
    );
    return furtherTreatmentChase !== undefined &&
      !furtherTreatmentChase.complete
      ? true
      : false;
  };

  surveyComplete = () => {
    return (
      this.props.completedSOAPSurvey !== null &&
      this.props.completedSOAPSurvey !== undefined
    );
  };

  extendCourseDuration = () => {
    this.setState({ showUpdateCaseDetailsModal: true });
  };

  cancelFurtherThreatementNeeded = () => {
    this.setState({
      furtherTreatmentAdded: false,
      showUpdateCaseDetailsModal: false
    });
  };

  returnFurtherTreatmentAdded = () => {
    this.setState({ furtherTreatmentAdded: true });
  };

  returnCompletedDate = completedDate => {
    this.setState({ completedDate });
  };

  completeSurvey = async () => {
    this.submitSoapSurvey(this.state.soapForm);
    this.props.history.push(
      `/cms/rehab/case/${this.props.bluedogCase.bluedogCaseRef}`
    );
  };

  showSurveyCompleteModal = soapForm => {
    this.setState({ soapForm, surveyCompletedModalOpen: true });
  };

  render() {
    const {
      message,
      painScores,
      showMessage,
      errorMessage,
      psfsActivities,
      invalidVASItems,
      invalidPSFSItems,
      vasListToValidate,
      showVASValidation,
      psfsListToValidate,
      currentPainKillers,
      showPSFSValidation,
      completedPainScores,
      furtherTreatmentAdded,
      completedPsfsActivities,
      removeValidationWarning
    } = this.state;
    return (
      <Row id="soapSurvey">
        <Col lg={6} sm={12}>
          <Row>
            <Col sm={12}>
              <SOAPForm
                id="soapForm"
                message={message}
                showMessage={showMessage}
                errorMessage={errorMessage}
                mi3dCase={this.props.mi3dCase}
                username={this.props.username}
                invalidVASItems={invalidVASItems}
                invalidPSFSItems={invalidPSFSItems}
                surveyComplete={this.surveyComplete()}
                checkIfVASIsValid={this.checkIfVASIsValid}
                checkIfPSFSIsValid={this.checkIfPSFSIsValid}
                extendCourseDuration={this.extendCourseDuration}
                removeValidationWarning={removeValidationWarning}
                showSurveyCompleteModal={this.showSurveyCompleteModal}
                furtherTreatmentAlreadyAdded={this.initialSOAPCallAlreadyCompleted()}
                furtherTreatmentAdded={furtherTreatmentAdded}
                soapSurvey={
                  this.props.completedSOAPSurvey !== undefined
                    ? this.props.completedSOAPSurvey
                    : null
                }
              />
            </Col>
          </Row>
        </Col>
        <Col lg={6} sm={12}>
          <Row>
            <Col sm={12}>
              <VAS
                surveyType="SOAP"
                id="soapSurveyVAS"
                painScores={painScores}
                vasListToValidate={vasListToValidate}
                surveyComplete={this.surveyComplete()}
                completedPainScores={completedPainScores}
                showValidationWarning={showVASValidation}
                getCurrentPainScore={this.getCurrentPainScores}
              />
            </Col>
          </Row>
          {currentPainKillers.standardPainKillers !== undefined && (
            <Row>
              <Col sm={12}>
                <PainKillers
                  id="soapSurveyPainKillers"
                  surveyComplete={this.surveyComplete()}
                  currentPainKillers={currentPainKillers}
                />
              </Col>
            </Row>
          )}
          <Row>
            <Col sm={12}>
              <PSFSActivities
                surveyType="SOAP"
                id="soapSurveyPSFSActivities"
                psfsActivities={psfsActivities}
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
              <CaseNotes
                mi3dCase={this.props.mi3dCase}
                username={this.props.username}
                bluedogCase={this.props.bluedogCase}
                updateMi3dCase={this.props.updateMi3dCase}
              />
            </Col>
          </Row>
        </Col>
        <UpdateCaseDetailsModal
          chaseType="SOAP"
          id="updateCaseDetailsModal"
          mi3dCase={this.props.mi3dCase}
          username={this.props.username}
          furtherTreatmentChaseNeeded={false}
          bluedogCase={this.props.bluedogCase}
          salasoId={this.props.mi3dCase.salasoId}
          updateMi3dCase={this.props.updateMi3dCase}
          isModalOpen={this.state.showUpdateCaseDetailsModal}
          courseDuration={this.props.mi3dCase.courseDurationInWeeks}
          returnFurtherTreatmentAdded={this.returnFurtherTreatmentAdded}
          closeModal={() =>
            this.setState({
              showUpdateCaseDetailsModal: false
            })
          }
          cancel={() =>
            this.setState({
              furtherTreatmentAdded: false,
              showUpdateCaseDetailsModal: false
            })
          }
          numberOfPrescribedExercises={
            this.props.mi3dCase.numberOfPrescribedExercises
          }
        />

        <SurveyCompleteModal
          isModalOpen={this.state.surveyCompletedModalOpen}
          closeModal={() => this.setState({ surveyCompletedModalOpen: false })}
          returnCompletedDate={this.returnCompletedDate}
          completeSurvey={this.completeSurvey}
        />
      </Row>
    );
  }
}
export default withErrorHandling(SOAPSurvey);
