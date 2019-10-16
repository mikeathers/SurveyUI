import React, { Component } from "react";
import _ from "lodash";
import * as api from "api";
import * as reasons from "helpers/stopCaseReasons";

import { checkIfArrayExistsInAnother } from "helpers/validation";
import { getBluedogInjuredPartyValues } from "helpers/email";
import { addSystemActivity, updateSystemActivity } from "helpers/util";
import { createInitialSurveyDocument } from "helpers/surveys";
import { withErrorHandling } from "HOCs";

import {
  questions,
  faceToFaceStatement,
  noTreatmentNeededStatement
} from "questions/initialSurveyQuestions";

import YesNoQuestion from "./YesNoQuestion/YesNoQuestion";
import ScaleQuestion from "./ScaleQuestion/ScaleQuestion";
import SurveyBuilder from "../SurveyBuilder/SurveyBuilder";
import SelectionQuestion from "./SelectionQuestion/SelectionQuestion";
import SurveyCompleteModal from "./SurveyCompleteModal/SurveyCompleteModal";
import StopCaseModal from "components/CMS/Rehab/StopCaseModal/StopCaseModal";

import {
  Col,
  Row,
  Card,
  Button,
  Message,
  ButtonContainer
} from "components/Common";

class InitialSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      modalTitle: "",
      initialKO: false,
      stopCaseReason: "",
      modalStatement: "",
      showMessage: false,
      modalButtonText: "",
      errorMessage: false,
      bluedogCaseValues: [],
      completedQuestions: [],
      surveySubmitted: false,
      screeningDate: new Date(),
      stopCaseModalOpen: false,
      backToCaseSubmitted: false,
      faceToFaceNeededAnswers: [],
      noTreatmentNeededAnswers: [],
      surpressCorrespondence: false,
      showCompleteSurveyModal: false,
      goToClinicianSurveySubmitted: false,
      completedInitialSurvey:
        props.completedInitialSurvey !== undefined
          ? props.completedInitialSurvey
          : {}
    };
    this.getBluedogInjuredPartyValues = getBluedogInjuredPartyValues.bind(this);
    this.addSystemActivity = addSystemActivity.bind(this);
    this.updateSystemActivity = updateSystemActivity.bind(this);
    this.createInitialSurveyDocument = createInitialSurveyDocument.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if (this.surveyComplete()) this.getCompletedInitialSurvey();
    this.getBluedogInjuredPartyValues(this.props.bluedogCase);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps({ completedInitialSurvey }) {
    this.setState({ completedInitialSurvey });
  }

  surveyComplete = () => {
    return (
      this.props.completedInitialSurvey !== null &&
      this.props.completedInitialSurvey !== undefined
    );
  };

  getCompletedInitialSurvey = async () => {
    const completedInitialSurveyId = this.state.completedInitialSurvey
      .completedInitialSurveyId;

    const completedInitialSurveyRequest = {
      completedSurveyId: completedInitialSurveyId,
      actionedBy: this.props.username
    };

    const response = await api.getCompletedInitialSurvey(
      completedInitialSurveyRequest
    );

    if (response !== undefined) {
      this.setState({
        initialSurvey: response.data,
        completedQuestions: response.data.completedQuestions
      });
    } else this.props.showErrorModal();
  };

  getCompletedQuestion = questionId => {
    return this.state.completedQuestions.find(q => q.questionId === questionId);
  };

  getCompletedQuestionAnswer = questionId => {
    const { completedQuestions } = this.state;
    if (completedQuestions !== null && this.surveyComplete()) {
      const completedQuestion = this.getCompletedQuestion(questionId);
      if (completedQuestion !== undefined) {
        return this.props.getCorrectAnswerForQuestionType(completedQuestion);
      }
    }
  };

  renderQuestions = () => {
    return questions.map((question, key) => {
      switch (question.type) {
        case "yesno":
          return (
            <YesNoQuestion
              key={key}
              question={question}
              returnUpdatedQuestion={this.handleUpdatedQuestion}
              answer={this.getCompletedQuestionAnswer(question.questionId)}
            />
          );
        case "scale":
          return (
            <ScaleQuestion
              key={key}
              question={question}
              returnUpdatedQuestion={this.handleUpdatedQuestion}
              answer={this.getCompletedQuestionAnswer(question.questionId)}
            />
          );
        case "selection":
          return (
            <SelectionQuestion
              key={key}
              question={question}
              returnUpdatedQuestion={this.handleUpdatedQuestion}
              answer={this.getCompletedQuestionAnswer(question.questionId)}
            />
          );
        default:
          break;
      }
      return null;
    });
  };

  handleUpdatedQuestion = question => {
    const answer = this.props.getCorrectAnswerForQuestionType(question);
    if (answer === "" || answer.length === 0 || answer === 0)
      this.removeFromCompletedQuestions(question);
    else this.addToCompletedQuestions(question);

    this.handleInstantKnockout(question);
    this.handleFaceToFaceNeeded(question);
    this.handleTreatmentNotRequired(question);
  };

  handleInstantKnockout = question => {
    const answer = this.props.getCorrectAnswerForQuestionType(question);
    if (
      question.instantKnockout === true &&
      answer === question.instantKnockoutAnswer
    ) {
      this.handleOpenStopCaseModal(
        "Treatment Not Required",
        "Stop Case",
        question.statement,
        true,
        question.stopCaseReason
      );
    }
  };

  handleOpenStopCaseModal = (
    modalTitle,
    modalButtonText,
    modalStatement,
    initialKO,
    stopCaseReason = ""
  ) => {
    this.setState({
      initialKO,
      modalTitle,
      modalStatement,
      stopCaseReason,
      modalButtonText,
      stopCaseModalOpen: true
    });
  };

  removeFromCompletedQuestions = questionToRemove => {
    const updatedQuestions = this.state.completedQuestions.filter(
      q => q.questionId !== questionToRemove.questionId
    );
    this.setState({
      completedQuestions: _.orderBy(updatedQuestions, ["questionId"]),
      showMessage: false
    });
  };

  addToCompletedQuestions = question => {
    const updatedQuestions = this.state.completedQuestions
      .filter(q => q.questionId !== question.questionId)
      .concat(question);
    this.setState({
      completedQuestions: _.orderBy(updatedQuestions, ["questionId"]),
      showMessage: false
    });
  };

  handleTreatmentNotRequired = question => {
    if (this.answerIsNoTreatmentNeededAnswer(question))
      this.addNoTreatmentAnswer(question);
    else this.removeNoTreatmentAnswer(question);
  };

  addNoTreatmentAnswer = question => {
    const { noTreatmentNeededAnswers } = this.state;
    this.setState({
      noTreatmentNeededAnswers: noTreatmentNeededAnswers
        .filter(q => q.questionId !== question.questionId)
        .concat(question)
    });
  };

  removeNoTreatmentAnswer = question => {
    let { noTreatmentNeededAnswers } = this.state;
    this.setState({
      noTreatmentNeededAnswers: noTreatmentNeededAnswers.filter(
        q => q.questionId !== question.questionId
      )
    });
  };

  answerIsNoTreatmentNeededAnswer = question => {
    const answer = this.props.getCorrectAnswerForQuestionType(question);
    return (
      (question.noTreatmentNeededAnswer !== undefined &&
        answer === question.noTreatmentNeededAnswer) ||
      answer <= question.noTreatmentNeededAnswer
    );
  };

  handleFaceToFaceNeeded = question => {
    if (this.answerIsKnockoutAnswer(question))
      this.addToFaceToFaceNeededAnswers(question);
    else this.removeFromFaceToFaceNeededAnswer(question);
  };

  addToFaceToFaceNeededAnswers = question => {
    const { faceToFaceNeededAnswers } = this.state;
    this.setState({
      faceToFaceNeededAnswers: faceToFaceNeededAnswers
        .filter(q => q.questionId !== question.questionId)
        .concat(question)
    });
  };

  removeFromFaceToFaceNeededAnswer = question => {
    const { faceToFaceNeededAnswers } = this.state;
    this.setState({
      faceToFaceNeededAnswers: faceToFaceNeededAnswers.filter(
        q => q.questionId !== question.questionId
      )
    });
  };

  answerIsKnockoutAnswer = question => {
    const answer = this.props.getCorrectAnswerForQuestionType(question);
    return (
      question.knockoutAnswer !== undefined &&
      (answer === question.knockoutAnswer ||
        answer.length >= 3 ||
        this.checkIfSelectionAnswerIsKnockout(question))
    );
  };

  checkIfSelectionAnswerIsKnockout = question => {
    if (question.type === "selection") {
      return question.knockoutAnswer.knockoutSelection.some(combo => {
        if (checkIfArrayExistsInAnother(combo, question.selectionAnswers)) {
          return true;
        }
        return false;
      });
    }
  };

  checkIfKnockedOut = () => {
    if (this.state.faceToFaceNeededAnswers.length > 0) return "F2F";
    if (this.state.noTreatmentNeededAnswers.length === 4) return "NoTreatment";
    return false;
  };

  checkIfSurveyCanBeAnswered = () => {
    return (
      !this.props.mi3dCase.dpaAccepted ||
      this.props.completedInitialSurvey !== null
    );
  };

  allQuestionsAnswered = () => {
    return this.state.completedQuestions.length === questions.length;
  };

  handleSubmitSurvey = () => {
    if (this.allQuestionsAnswered()) {
      const knockedOut = this.checkIfKnockedOut();
      if (!knockedOut) {
        this.setState({
          showCompleteSurveyModal: true,
          surveySubmitted: false
        });
      } else {
        if (knockedOut === "F2F") {
          this.handleOpenStopCaseModal(
            "Face To Face Treatment Required",
            "Close Case",
            faceToFaceStatement,
            false,
            reasons.initialSurveyCompleteF2FNeeded
          );
        } else if (knockedOut === "NoTreatment") {
          this.handleOpenStopCaseModal(
            "Treatment Not Required",
            "Close Case",
            noTreatmentNeededStatement,
            false,
            reasons.initialSurveyCompleteNoTreatmentNeeded
          );
        }
      }
    } else {
      this.setState({
        message: "Please complete all survey questions before submitting.",
        errorMessage: true,
        showMessage: true
      });
    }
  };

  completedSurvey = () => {
    const { completedQuestions } = this.state;
    const completedSurvey = {
      type: "Initial",
      actionedBy: this.props.username,
      completedBy: this.props.username,
      caseId: this.props.mi3dCase.caseId,
      completedDate: this.state.screeningDate,
      completedQuestions: this.props.parseCompletedQuestions(completedQuestions)
    };
    return completedSurvey;
  };

  captureScreeningDate = async () => {
    const screeningDateInfo = {
      bluedogCaseRef: this.props.bluedogCase.bluedogCaseRef,
      screeningDate: this.state.screeningDate
    };
    await api.captureScreeningDate(screeningDateInfo);
  };

  saveCompletedSurveyWhenKnockedOut = async () => {
    const {
      completedQuestions,
      screeningDate,
      bluedogCaseValues,
      initialKO
    } = this.state;
    this.captureScreeningDate();
    const response = await api.saveCompletedInitialSurvey(
      this.completedSurvey()
    );
    if (response !== undefined) {
      if (response.status === 200) {
        this.props.updateMi3dCase(response.data);
        const systemActivityId = await this.addSystemActivity(
          "Create Initial Survey Document",
          "Document",
          "Pending"
        );
        if (!initialKO) {
          const initialSurveyDocument = await this.createInitialSurveyDocument(
            completedQuestions,
            screeningDate,
            bluedogCaseValues
          );
          if (initialSurveyDocument)
            await this.updateSystemActivity(systemActivityId, "Success");
          else await this.updateSystemActivity(systemActivityId, "Error");

          return initialSurveyDocument;
        }
      }
      return null;
    } else this._isMounted && this.props.showErrorModal();
  };

  saveCompletedSurvey = async continueToClinicianSurvey => {
    const { completedQuestions, screeningDate, bluedogCaseValues } = this.state;
    this.setState({ surveySubmitted: true });

    const response = await api.saveCompletedInitialSurvey(
      this.completedSurvey()
    );

    if (response !== undefined) {
      if (response.status === 200) {
        this.props.updateMi3dCase(response.data);
        if (continueToClinicianSurvey) this.goToClinicianSurvey();
        const systemActivityId = await this.addSystemActivity(
          "Create Initial Survey Document",
          "Document",
          "Pending"
        );
        const initialSurveyDocument = await this.createInitialSurveyDocument(
          completedQuestions,
          screeningDate,
          bluedogCaseValues
        );
        if (initialSurveyDocument)
          await this.updateSystemActivity(systemActivityId, "Success");
        else await this.updateSystemActivity(systemActivityId, "Error");
      }
    } else {
      this.setState({ surveySubmitted: false });
      this.props.showErrorModal();
    }
  };

  getCase = async caseId => {
    const response = await api.getCase(caseId);
    if (response !== undefined) {
      this.props.updateMi3dCase(response.data);
    } else this.props.showErrorModal();
  };

  handleCloseModal = () => {
    this.setState({
      modalTitle: "",
      modalStatement: "",
      modalButtonText: "",
      stopCaseModalOpen: false
    });
  };

  submitSurveyAndGoBackToCase = async () => {
    this.setState({ backToCaseSubmitted: true });
    this.saveCompletedSurvey(false);
    this.goBackToCase();
  };

  goBackToCase = () => {
    this.props.goBackToCase();
  };

  continueToClinicianSurvey = async () => {
    this.setState({ goToClinicianSurveySubmitted: true });
    await this.saveCompletedSurvey(true);
  };

  goToClinicianSurvey = () => {
    this.props.history.push(
      `/cms/rehab/survey/clinician/${this.props.bluedogCase.bluedogCaseRef}`
    );
  };

  returnScreeningDate = screeningDate => {
    this.setState({ screeningDate });
  };

  render() {
    return (
      <Row id="initialSurvey">
        {/* LEFT SIDE  */}
        <Col lg={6} sm={12}>
          <Row>
            <Col sm={12}>
              <Card
                id="initialSurveyCard"
                title="Triage Questions"
                disabled={this.checkIfSurveyCanBeAnswered()}
              >
                <div className="initial-survey">{this.renderQuestions()}</div>
                <ButtonContainer
                  marginTop="25"
                  marginBottom="5"
                  justifyContent="flex-end"
                >
                  <Button
                    primary
                    content="Submit Survey"
                    id="initialSurveySubmitBtn"
                    onClick={this.handleSubmitSurvey}
                    disabled={this.state.surveySubmitted}
                  />
                </ButtonContainer>
                <Message
                  marginTop="30"
                  justifyContent="flex-end"
                  message={this.state.message}
                  show={this.state.showMessage}
                  error={this.state.errorMessage}
                  id="initialSurveyValidationMessage"
                />
              </Card>
            </Col>
          </Row>
        </Col>
        {/* END OF LEFT SIDE  */}

        {/* RIGHT SIDE */}
        <Col lg={6} sm={12}>
          <Row>
            <Col sm={12}>
              <SurveyBuilder
                mi3dCase={this.props.mi3dCase}
                username={this.props.username}
                bluedogCase={this.props.bluedogCase}
                completedQuestions={this.state.completedQuestions}
                getCorrectAnswerForQuestionType={
                  this.props.getCorrectAnswerForQuestionType
                }
              />
            </Col>
          </Row>
        </Col>
        {/* END OF RIGHT SIDE */}

        <SurveyCompleteModal
          id="clinicianSurveySurveyCompleteModal"
          surveySubmitted={this.state.surveySubmitted}
          returnScreeningDate={this.returnScreeningDate}
          goBackToCase={this.submitSurveyAndGoBackToCase}
          isModalOpen={this.state.showCompleteSurveyModal}
          backToCaseSubmitted={this.state.backToCaseSubmitted}
          continueToClinicianSurvey={this.continueToClinicianSurvey}
          closeModal={() => this.setState({ showCompleteSurveyModal: false })}
          goToClinicianSurveySubmitted={this.state.goToClinicianSurveySubmitted}
        />

        <StopCaseModal
          id="stopCaseModal"
          initialSurvey={true}
          history={this.props.history}
          title={this.state.modalTitle}
          initialKO={this.state.initialKO}
          statement={this.state.modalStatement}
          stopCaseReason={this.state.stopCaseReason}
          isModalOpen={this.state.stopCaseModalOpen}
          buttonContent={this.state.modalButtonText}
          closeModal={this.handleCloseModal}
          saveCompletedInitialSurveyWhenKnockedOut={
            this.saveCompletedSurveyWhenKnockedOut
          }
        />
      </Row>
    );
  }
}
export default withErrorHandling(InitialSurvey);
