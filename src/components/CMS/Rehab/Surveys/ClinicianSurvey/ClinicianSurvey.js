import React, { Component } from "react";
import * as api from "api";
import _ from "lodash";

import { getBluedogInjuredPartyValues } from "helpers/email";
import { addSystemActivity, updateSystemActivity } from "helpers/util";
import { createClinicianSurveyDocument } from "helpers/surveys";

import {
  questionGroups,
  bodyPartQuestions,
  knockoutQuestions
} from "questions/clinicianSurveyQuestions";

import {withErrorHandling} from "HOCs";

import Actions from "./Actions/Actions";
import WADScore from "./WADScore/WADScore";
import PSFSScore from "./PSFSScore/PSFSScore";
import ScaleQuestion from "./Questions/ScaleQuestion/ScaleQuestion";
import SurveyCompleteModal from "../SurveyCompleteModal/SurveyCompleteModal";
import FollowUpQuestion from "./Questions/FollowUpQuestion/FollowUpQuestion";
import FreeTextQuestion from "./Questions/FreeTextQuestion/FreeTextQuestion";
import DiabetesQuestion from "./Questions/DiabetesQuestion/DiabetesQuestion";
import DropdownQuestion from "./Questions/DropdownQuestion/DropdownQuestion";
import StopCaseModal from "components/CMS/Rehab/StopCaseModal/StopCaseModal";
import PainKillerQuestion from "./Questions/PainKillerQuestion/PainKillerQuestion";
import FactFindingQuestion from "./Questions/FactFindingQuestion/FactFindingQuestion";

import { Row, Col, Card } from "components/Common";

import "./ClinicianSurvey.scss";

class ClinicianSurvey extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      wadText: "",
      wadScore: "",
      offSetTop: 0,
      painScore: "",
      modalTitle: "",
      stopSurvey: false,
      psfsActivities: [],
      stopCaseReason: "",
      modalStatement: "",
      showMessage: false,
      errorMessage: false,
      selectedBodyParts: [],
      bluedogCaseValues: [],
      surveyNotComplete: true,
      stopCaseModalOpen: false,
      completedDate: new Date(),
      completedQuestionsLength: 0,
      selectedKnockoutBodyParts: [],
      followUpToDisplay: "followUpOne",
      injuredPartyTakesPainKillers: false,
      initialSurveyQuestions: this.props.initialSurveyQuestions,
      completedQuestions:
        props.completedQuestions !== undefined ? props.completedQuestions : [],
      completedClinicianSurvey:
        props.completedClinicianSurvey !== undefined
          ? props.completedClinicianSurvey
          : null
    };

    this.getBluedogInjuredPartyValues = getBluedogInjuredPartyValues.bind(this);
    this.addSystemActivity = addSystemActivity.bind(this);
    this.updateSystemActivity = updateSystemActivity.bind(this);
    this.createClinicianSurveyDocument = createClinicianSurveyDocument.bind(
      this
    );
  }

  componentDidMount() {
    setTimeout(() => window.scrollTo(0, 0), 1000);
    this._isMounted = true;
    setTimeout(() => this.getCompletedQuestionsLength(), 2000);
    this.getBluedogInjuredPartyValues(this.props.bluedogCase);
    this.getCompletedInitialSurvey();
    if (this.surveyComplete()) this.getCompletedClinicianSurvey();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getCompletedClinicianSurvey = async () => {
    const completedClinicianSurveyId = this.props.completedClinicianSurvey
      .completedClinicianSurveyId;

    const completedClinicianSurveyRequest = {
      completedSurveyId: completedClinicianSurveyId,
      actionedBy: this.props.username
    };

    const response = await api.getCompletedClinicianSurvey(
      completedClinicianSurveyRequest
    );

    if (response !== undefined) {
      this.setState({
        clinicianSurvey: response.data,
        completedQuestions: response.data.completedQuestions,
        wadScore: response.data.wadScore,
        psfsActivities: response.data.completedClinicianSurveyPsfsActivities
      });
    } else this.props.showErrorModal();
  };

  getCompletedInitialSurvey = async () => {
    const initialSurvey = this.props.mi3dCase.completedInitialSurvey;

    if (initialSurvey !== undefined && initialSurvey !== null) {
      const completedInitialSurveyId = initialSurvey.completedInitialSurveyId;

      const completedInitialSurveyRequest = {
        completedSurveyId: completedInitialSurveyId,
        actionedBy: this.props.username
      };

      const response = await api.getCompletedInitialSurvey(
        completedInitialSurveyRequest
      );

      if (response !== undefined) {
        this.setState(
          {
            initialSurvey: response.data,
            completedInitialSurveyQuestions: response.data.completedQuestions
          },
          () => {
            this.handleInitialSurveyQuestions(response.data.completedQuestions);
          }
        );
      } else this.props.showErrorModal();
    }
  };

  getCompletedQuestion = (questionId, questionGroupId) => {
    return this.state.completedQuestions.find(
      q => q.questionId === questionId && q.questionGroupId === questionGroupId
    );
  };

  getCompletedQuestionAnswer = (questionId, questionGroupId) => {
    const { completedQuestions } = this.state;
    if (completedQuestions !== null && completedQuestions !== undefined) {
      const completedQuestion = this.getCompletedQuestion(
        questionId,
        questionGroupId
      );
      if (completedQuestion !== undefined) {
        const completedAnswer = this.props.getCorrectAnswerForQuestionType(
          completedQuestion
        );
        return completedAnswer;
      }
    }
  };

  getCompletedQuestionAdditionalInfo = (questionId, questionGroupId) => {
    const { completedQuestions } = this.state;
    if (completedQuestions !== null || completedQuestions !== undefined) {
      const completedQuestion = this.getCompletedQuestion(
        questionId,
        questionGroupId
      );
      if (
        completedQuestion !== undefined &&
        completedQuestion.additionalInfo !== undefined
      ) {
        return completedQuestion.additionalInfo;
      }
    }
  };

  getCompletedQuestionDropdownAnswer = (questionId, questionGroupId) => {
    const { completedQuestions } = this.state;
    if (completedQuestions !== null || completedQuestions !== undefined) {
      const completedQuestion = this.getCompletedQuestion(
        questionId,
        questionGroupId
      );
      if (
        completedQuestion !== undefined &&
        completedQuestion.dropdownAnswer !== undefined
      ) {
        return completedQuestion.dropdownAnswer;
      }
    }
  };

  handleInitialSurveyQuestions = initialSurveyQuestions => {
    if (initialSurveyQuestions !== undefined) {
      this.setState({ initialSurveyQuestions }, () => {
        this.handleBodyPartQuestion();
        this.handlePainKillerQuestion();
        this.handlePainScoreQuestion();
      });
    }
  };

  handleBodyPartQuestion = () => {
    const question = this.state.initialSurveyQuestions.find(
      q => q.type === "selection"
    );
    if (question !== undefined) {
      const selectedBodyParts = question.selectionAnswers;
      this.parseSelectedBodyParts(selectedBodyParts);
      this.setState({ selectedBodyParts });
    }
  };

  handlePainKillerQuestion = () => {
    const question = this.state.initialSurveyQuestions.find(q =>
      q.questionText.includes("pain killers")
    );
    if (question !== undefined) this.checkIfIPTakesPainKillers(question);
  };

  handlePainScoreQuestion = () => {
    const question = this.state.initialSurveyQuestions.find(
      q => q.type === "scale"
    );
    if (question !== undefined)
      this.setState({ painScore: question.scaleAnswer });
  };

  handleShowCard = questionGroup => {
    const {
      injuredPartyTakesPainKillers,
      selectedKnockoutBodyParts
    } = this.state;
    if (questionGroup.openByDefault) return true;
    if (selectedKnockoutBodyParts.includes(questionGroup.type)) return true;
    if (questionGroup.id === "fullDrugHistory" && injuredPartyTakesPainKillers)
      return true;
    return questionGroup.openByDefault;
  };

  handleUpdatedQuestion = question => {
    const completedQuestion = this.getCompletedQuestion(
      question.questionId,
      question.questionGroupId
    );

    const answer = this.props.getCorrectAnswerForQuestionType(question);

    if (answer === "" || answer === 0 || answer.length === 0)
      this.removeFromCompletedQuestions(completedQuestion);
    else this.addToCompletedQuestions(question, completedQuestion, answer);
  };

  handleFollowUpToDisplay = followUpToDisplay => {
    this.setState({ followUpToDisplay });
  };

  handleWadScore = (wadScore, wadText) => {
    this.setState({ wadScore, wadText }, () =>
      this.setState({ surveyNotComplete: this.surveyNotComplete() })
    );
  };

  handlePsfsActivities = psfsActivities => {
    this.setState({ psfsActivities });
  };

  handleSubmitSurvey = () => {
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

  removeFromCompletedQuestions = questionToRemove => {
    const updatedQuestions = this.state.completedQuestions.filter(
      q => q !== questionToRemove
    );
    this.setState({ completedQuestions: updatedQuestions }, () =>
      this.setState({ surveyNotComplete: this.surveyNotComplete() })
    );
  };

  addToCompletedQuestions = (question, completedQuestion, answer) => {
    const updatedQuestions = this.state.completedQuestions
      .filter(q => q !== completedQuestion)
      .concat(question);
    this.setState({ completedQuestions: updatedQuestions }, () => {
      if (answer === "Yes") this.setState({ stopSurvey: true });
    });
  };

  renderQuestions = (question, questionGroup, key) => {
    const questionId = question.questionId;
    const questionGroupId = questionGroup.id;
    switch (question.type) {
      case "followup":
        return (
          <FollowUpQuestion
            key={key}
            question={question}
            questionGroup={questionGroup}
            returnUpdatedQuestion={this.handleUpdatedQuestion}
            returnFollowUpToDisplay={this.handleFollowUpToDisplay}
            answer={this.getCompletedQuestionAnswer(
              questionId,
              questionGroupId
            )}
            additionalInfo={this.getCompletedQuestionAdditionalInfo(
              questionId,
              questionGroupId
            )}
          />
        );
      case "freetext":
        return (
          <FreeTextQuestion
            key={key}
            question={question}
            questionGroup={questionGroup}
            returnUpdatedQuestion={this.handleUpdatedQuestion}
            answer={this.getCompletedQuestionAnswer(
              questionId,
              questionGroupId
            )}
            additionalInfo={this.getCompletedQuestionAdditionalInfo(
              questionId,
              questionGroupId
            )}
          />
        );
      case "diabetes":
        return (
          <DiabetesQuestion
            key={key}
            question={question}
            questionGroup={questionGroup}
            returnUpdatedQuestion={this.handleUpdatedQuestion}
            answer={this.getCompletedQuestionAnswer(
              questionId,
              questionGroupId
            )}
            additionalInfo={this.getCompletedQuestionAdditionalInfo(
              questionId,
              questionGroupId
            )}
          />
        );
      case "painkillers":
        return (
          <PainKillerQuestion
            key={key}
            question={question}
            questionGroup={questionGroup}
            returnUpdatedQuestion={this.handleUpdatedQuestion}
            answer={this.getCompletedQuestionAnswer(
              questionId,
              questionGroupId
            )}
            additionalInfo={this.getCompletedQuestionAdditionalInfo(
              questionId,
              questionGroupId
            )}
          />
        );
      case "factfinding":
        return (
          <FactFindingQuestion
            key={key}
            question={question}
            questionGroup={questionGroup}
            returnUpdatedQuestion={this.handleUpdatedQuestion}
            answer={this.getCompletedQuestionAnswer(
              questionId,
              questionGroupId
            )}
            additionalInfo={this.getCompletedQuestionAdditionalInfo(
              questionId,
              questionGroupId
            )}
          />
        );
      case "scale":
        return (
          <ScaleQuestion
            key={key}
            question={question}
            questionGroup={questionGroup}
            painScore={this.state.painScore}
            returnUpdatedQuestion={this.handleUpdatedQuestion}
            answer={this.getCompletedQuestionAnswer(
              questionId,
              questionGroupId
            )}
          />
        );
      case "dropdown":
        return (
          <DropdownQuestion
            key={key}
            question={question}
            questionGroup={questionGroup}
            returnUpdatedQuestion={this.handleUpdatedQuestion}
            additionalInfo={this.getCompletedQuestionAdditionalInfo(
              questionId,
              questionGroupId
            )}
            dropdownAnswer={this.getCompletedQuestionDropdownAnswer(
              questionId,
              questionGroupId
            )}
          />
        );
      default:
        break;
    }
  };

  renderKnockoutCards = () => {
    return knockoutQuestions.map((questionGroup, key) => {
      if (this.handleShowCard(questionGroup)) {
        return (
          <Card
            key={key}
            collapse={false}
            title={questionGroup.type}
            id={`${questionGroup.id}Card`}
            isOpenByDefault={this.handleShowCard(questionGroup)}
            disabled={
              this.state.stopSurvey || this.checkIfSurveyCanBeAnswered()
            }
          >
            {questionGroup.questions.map((question, key) =>
              this.renderQuestions(question, questionGroup, key)
            )}
          </Card>
        );
      }
      return null;
    });
  };

  renderInjuredBodyPartsCards = () => {
    return this.state.selectedBodyParts.map((bodyPart, key) => {
      const parsedBodyPart = bodyPart.replace(/\s/g, "");
      const updatedBodyPartsQuestions = {
        ...bodyPartQuestions,
        id: `injuredBodyPart_${parsedBodyPart}`
      };
      return (
        <Card
          key={key}
          collapse={false}
          title={`Injured Body Part - ${bodyPart}`}
          id={`injuredBodyPart${parsedBodyPart}Card`}
          isOpenByDefault={this.handleShowCard(bodyPartQuestions)}
          disabled={this.state.stopSurvey || this.checkIfSurveyCanBeAnswered()}
        >
          {bodyPartQuestions.questions.map((question, key) =>
            this.renderQuestions(question, updatedBodyPartsQuestions, key)
          )}
        </Card>
      );
    });
  };

  renderQuestionGroupCards = () => {
    return questionGroups.map((questionGroup, key) => {
      if (this.handleShowCard(questionGroup)) {
        return (
          <Card
            key={key}
            collapse={false}
            title={questionGroup.type}
            id={`${questionGroup.id}Card`}
            isOpenByDefault={this.handleShowCard(questionGroup)}
            disabled={
              this.state.stopSurvey || this.checkIfSurveyCanBeAnswered()
            }
          >
            {questionGroup.questions.map((question, key) =>
              this.renderQuestions(question, questionGroup, key)
            )}
          </Card>
        );
      }
      return null;
    });
  };

  returnCompletedDate = completedDate => {
    this.setState({ completedDate });
  };

  parseSelectedBodyParts = bodyParts => {
    let selectedKnockoutBodyParts = [];

    bodyParts.forEach(bodyPart => {
      if (bodyPart === "Lower Back")
        selectedKnockoutBodyParts.push("Lumbar Spine");
      if (bodyPart === "Neck") selectedKnockoutBodyParts.push("Cervical Spine");
      if (bodyPart === "Mid Back")
        selectedKnockoutBodyParts.push("Thoracic Spine");
    });

    this.setState({ selectedKnockoutBodyParts });
  };

  checkIfIPTakesPainKillers = painKillerQuestion => {
    if (painKillerQuestion.yesNoAnswer === "Yes")
      this.setState({ injuredPartyTakesPainKillers: true });
  };

  checkIfSurveyCanBeAnswered = () => {
    return (
      !this.props.dpaAccepted || this.state.completedClinicianSurvey !== null
    );
  };

  saveCompletedSurvey = async () => {
    const { completedQuestions } = this.state;
    const type = "Clinician";
    const wadText = this.state.wadText;
    const wadScore = this.state.wadScore;
    const psfsActivities = this.state.psfsActivities;

    const survey = {
      type,
      wadText,
      wadScore,
      actionedBy: this.props.username,
      completedBy: this.props.username,
      caseId: this.props.mi3dCase.caseId,
      completedDate: this.state.completedDate,
      completedQuestions: this.props.parseCompletedQuestions(
        completedQuestions
      ),
      completedClinicianSurveyPsfsActivities: _.orderBy(psfsActivities, [
        "activity"
      ])
    };

    const response = await api.saveCompletedClinicianSurvey(survey);

    if (response !== undefined) {
      if (response.status === 200) {
        this.props.updateMi3dCase(response.data);

        const systemActivityId = await this.addSystemActivity(
          "Create Clinician Survey Document",
          "Document",
          "Pending"
        );

        const clinicianSurveyDocument = await this.createClinicianSurveyDocument(
          response.data.completedClinicianSurvey,
          this.state.bluedogCaseValues
        );

        if (clinicianSurveyDocument)
          await this.updateSystemActivity(systemActivityId, "Success");
        else await this.updateSystemActivity(systemActivityId, "Error");

        return clinicianSurveyDocument;
      } else return false;
    } else {
      this.props.showErrorModal();
      return false;
    }
  };

  getCase = async caseId => {
    const response = await api.getCase(caseId);
    if (response !== undefined) {
      this.props.updateMi3dCase(response.data);
    } else this.props.showErrorModal();
  };

  getQuestionGroupsForCompletedQuestions = () => {
    let questionGroups = [];
    const questions = this.state.completedQuestions;

    questions.forEach(question => {
      const updatedQuestionGroups = questionGroups
        .filter(q => q.id !== question.questionGroup.id)
        .concat({
          id: question.questionGroup.id,
          type: question.questionGroup.type
        });
      questionGroups = updatedQuestionGroups;
    });

    let questionGroupsWithQuestions = [];

    questionGroups.forEach(questionGroup => {
      let bodyPart;
      if (questionGroup.id.includes("_")) {
        bodyPart = questionGroup.id
          .split("_")
          .pop()
          .replace(/([A-Z])/g, " $1")
          .trim();
      }
      const group = {
        id: questionGroup.id,
        name:
          questionGroup.type === "Injured Body Parts"
            ? `${questionGroup.type} - ${bodyPart}`
            : questionGroup.type,
        completedQuestions: []
      };
      questionGroupsWithQuestions.push(group);
    });

    return questionGroupsWithQuestions;
  };

  sortCompletedQuestionsIntoQuestionGroups = questionGroups => {
    const questions = this.state.completedQuestions;

    questions.forEach(question => {
      questionGroups.forEach(group => {
        if (question.questionGroup.id === group.id) {
          group.completedQuestions.push(question);
        }
      });
    });

    return questionGroups;
  };

  getCompletedQuestionsLength = () => {
    let completedQuestionsLength = document.querySelectorAll(".question-text")
      .length;
    this.setState({ completedQuestionsLength });
  };

  surveyNotComplete = () => {
    return (
      this.state.wadScore === "" ||
      this.state.completedQuestions.length !==
        this.state.completedQuestionsLength ||
      this.state.psfsActivities.length < 1
    );
  };

  surveyComplete = () => {
    return (
      this.props.completedClinicianSurvey !== null &&
      this.props.completedClinicianSurvey !== undefined
    );
  };

  continueSurvey = () => {
    this.setState({ stopSurvey: false });
  };

  completeSurvey = () => {
    this.saveCompletedSurvey();
    this.props.history.push("/cms/rehab/completedsurvey/clinician");
  };

  render() {
    return (
      <Row id="clinicianSurvey" className="clinician-survey">
        <Col lg={6} md={12} sm={12}>
          {this.renderKnockoutCards()}
          {this.renderInjuredBodyPartsCards()}
          {this.renderQuestionGroupCards()}

          <WADScore
            id="clinicianSurveyWADScore"
            wadScore={this.state.wadScore}
            returnWadScore={this.handleWadScore}
            disabled={
              this.state.stopSurvey || this.checkIfSurveyCanBeAnswered()
            }
          />

          <PSFSScore
            id="clinicianSurveyPSFSScore"
            psfsActivities={this.state.psfsActivities}
            returnActivities={this.handlePsfsActivities}
            disabled={
              this.state.stopSurvey || this.checkIfSurveyCanBeAnswered()
            }
          />
        </Col>
        <Col lg={6} md={12} sm={12}>
          <Actions
            id="clinicianSurveyActions"
            message={this.state.message}
            offSetTop={this.state.offSetTop}
            stopSurvey={this.state.stopSurvey}
            showMessage={this.state.showMessage}
            continueSurvey={this.continueSurvey}
            submitSurvey={this.handleSubmitSurvey}
            errorMessage={this.state.errorMessage}
            surveyNotComplete={this.surveyNotComplete()}
            followUpToDisplay={this.state.followUpToDisplay}
            handleOpenStopCaseModal={this.handleOpenStopCaseModal}
            checkIfSurveyCanBeAnswered={this.checkIfSurveyCanBeAnswered}
            noQuestionsAnswered={this.state.completedQuestions.length === 0}
          />
        </Col>
        <SurveyCompleteModal
          isModalOpen={this.state.surveyCompletedModalOpen}
          closeModal={() => this.setState({ surveyCompletedModalOpen: false })}
          returnCompletedDate={this.returnCompletedDate}
          completeSurvey={this.completeSurvey}
        />

        <StopCaseModal
          id="stopCaseModal"
          clinicianSurvey={true}
          history={this.props.history}
          title={this.state.modalTitle}
          statement={this.state.modalStatement}
          stopCaseReason={this.state.stopCaseReason}
          isModalOpen={this.state.stopCaseModalOpen}
          buttonContent={this.state.modalButtonText}
          saveCompletedClinicianSurvey={this.saveCompletedSurvey}
          closeModal={() => this.setState({ stopCaseModalOpen: false })}
          saveCompletedSurveyWhenKnockedOut={
            this.saveCompletedSurveyWhenKnockedOut
          }
        />
      </Row>
    );
  }
}

export default withErrorHandling(ClinicianSurvey);
