import React, { Component } from "react";
import _ from "lodash";
import moment from "moment";
import * as api from "api";
import { connect } from "react-redux";

import {
  updateMi3dCase,
  selectSecondaryItem,
  updateBluedogCase
} from "actions";

import { withErrorHandling, withCaseLocking } from "HOCs";

import DPAModal from "components/CMS/Rehab/DPAModal/DPAModal";
import PageTopBar from "components/CMS/Rehab/PageTopBar/PageTopBar";
import SOAPSurvey from "components/CMS/Rehab/Surveys/SOAPSurvey/SOAPSurvey";
import StopCaseModal from "components/CMS/Rehab/StopCaseModal/StopCaseModal";
import InitialSurvey from "components/CMS/Rehab/Surveys/InitialSurvey/InitialSurvey";
import CaseLockedModal from "components/CMS/Rehab/Case/CaseLockedModal/CaseLockedModal";
import DischargeSurvey from "components/CMS/Rehab/Surveys/DischargeSurvey/DischargeSurvey";
import ClinicianSurvey from "components/CMS/Rehab/Surveys/ClinicianSurvey/ClinicianSurvey";

import { Container } from "components/Common";

import "./Surveys.scss";

export class Survey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyName: "",
      modalTitle: "",
      modalStatement: "",
      modalButtonText: "",
      modalReasonText: "",
      initialSurvey: null,
      dpaModalOpen: false,
      clinicianSurvey: null,
      surveySubmitted: false,
      completedQuestions: [],
      stopCaseModalOpen: false,
      caseLockedModalOpen: false,
      completedInitialSurveyQuestions: [],
      completedClinicianSurveyQuestions: []
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.renderName();
  }

  componentWillReceiveProps() {
    this.renderName();
  }

  handleSurveySubmitted = () => {
    this.setState({ surveySubmitted: true });
  };

  renderSurvey = () => {
    const survey = this.props.history.location.pathname;
    if (survey.includes("initial")) {
      return (
        <InitialSurvey
          history={this.props.history}
          mi3dCase={this.props.mi3dCase}
          username={this.props.username}
          goBackToCase={this.goBackToCase}
          bluedogCase={this.props.bluedogCase}
          updateMi3dCase={this.props.updateMi3dCase}
          surveySubmitted={this.state.surveySubmitted}
          getCompletedSurvey={this.getCompletedSurvey}
          openStopCaseModal={this.handleOpenStopCaseModal}
          addDocumentToMi3DCase={this.addDocumentToMi3DCase}
          parseCompletedQuestions={this.parseCompletedQuestions}
          createSurveyDocument={this.createInitialSurveyDocument}
          completedInitialSurvey={this.props.completedInitialSurvey}
          continueToClinicianSurvey={this.continueToClinicianSurvey}
          completedQuestions={this.state.completedInitialSurveyQuestions}
          completedQuestionsForDocument={this.completedQuestionsForDocument}
          getCorrectAnswerForQuestionType={this.getCorrectAnswerForQuestionType}
        />
      );
    }
    if (survey.includes("clinician")) {
      return (
        <ClinicianSurvey
          history={this.props.history}
          mi3dCase={this.props.mi3dCase}
          username={this.props.username}
          goBackToCase={this.goBackToCase}
          bluedogCase={this.props.bluedogCase}
          updateMi3dCase={this.props.updateMi3dCase}
          dpaAccepted={this.props.mi3dCase.dpaAccepted}
          openStopCaseModal={this.handleOpenStopCaseModal}
          addDocumentToMi3DCase={this.addDocumentToMi3DCase}
          parseCompletedQuestions={this.parseCompletedQuestions}
          createSurveyDocument={this.createInitialSurveyDocument}
          completedInitialSurvey={this.props.completedInitialSurvey}
          completedClinicianSurvey={this.props.completedClinicianSurvey}
          completedQuestions={this.state.completedClinicianSurveyQuestions}
          completedQuestionsForDocument={this.completedQuestionsForDocument}
          initialSurveyQuestions={this.state.completedInitialSurveyQuestions}
          getCorrectAnswerForQuestionType={this.getCorrectAnswerForQuestionType}
        />
      );
    }
    if (survey.includes("soap")) {
      return (
        <SOAPSurvey
          history={this.props.history}
          mi3dCase={this.props.mi3dCase}
          username={this.props.username}
          bluedogCase={this.props.bluedogCase}
          updateMi3dCase={this.props.updateMi3dCase}
          addDocumentToMi3DCase={this.addDocumentToMi3DCase}
          completedClinicianSurvey={this.props.completedClinicianSurvey}
          completedSOAPSurvey={this.props.mi3dCase.completedSOAPSurvey}
          completedQuestionsForDocument={this.completedQuestionsForDocument}
        />
      );
    }
    if (survey.includes("discharge")) {
      const clinicianSurvey = this.state.clinicianSurvey;
      return (
        <DischargeSurvey
          history={this.props.history}
          mi3dCase={this.props.mi3dCase}
          username={this.props.username}
          goBackToCase={this.goBackToCase}
          bluedogCase={this.props.bluedogCase}
          updateMi3dCase={this.props.updateMi3dCase}
          addDocumentToMi3DCase={this.addDocumentToMi3DCase}
          completedSOAPSurvey={this.props.mi3dCase.completedSOAPSurvey}
          completedClinicianSurvey={this.props.completedClinicianSurvey}
          psfsActivities={
            clinicianSurvey !== null ? clinicianSurvey.psfsActivities : []
          }
          clinicianSurveyQuestions={
            clinicianSurvey !== null ? clinicianSurvey.completedQuestions : []
          }
          completedDischargeSurvey={
            this.props.mi3dCase.completedDischargeSurvey
          }
        />
      );
    }
  };

  renderName = () => {
    const survey = this.props.history.location.pathname;
    if (survey.includes("initial"))
      this.setState({ surveyName: "Initial Survey" });
    if (survey.includes("clinician"))
      this.setState({ surveyName: "Clinician Survey" });
    if (survey.includes("soap")) this.setState({ surveyName: "SOAP Survey" });
    if (survey.includes("discharge"))
      this.setState({ surveyName: "Discharge Survey" });
  };

  parseCompletedSurvey = (
    type,
    wadText = "",
    wadScore = "",
    activities = null,
    completedQuestions
  ) => {
    const { mi3dCase, username } = this.props;
    switch (type) {
      case "Initial":
        return {
          type: type,
          actionedBy: username,
          completedBy: username,
          caseId: mi3dCase.caseId,
          completedQuestions: this.parseCompletedQuestions(completedQuestions)
        };
      case "Clinician":
        return {
          wadText,
          wadScore,
          type: type,
          actionedBy: username,
          completedBy: username,
          caseId: mi3dCase.caseId,
          psfsActivities: activities,
          completedQuestions: this.parseCompletedQuestions(completedQuestions)
        };
      default:
        break;
    }
  };

  parseCompletedQuestions = completedQuestions => {
    return completedQuestions.map(question => {
      return {
        type: question.type,
        questionId: question.questionId,
        questionText: question.questionText,
        textAnswer: question.type === "text" ? question.textAnswer : "",
        scaleAnswer: question.type === "scale" ? question.scaleAnswer : 0,
        yesNoAnswer: question.type === "yesno" ? question.yesNoAnswer : "",
        questionGroupId:
          question.questionGroup !== undefined ? question.questionGroupId : "",
        dropdownAnswer:
          question.type === "dropdown" ? question.dropdownAnswer : "",
        additionalInfo:
          question.additionalInfo !== undefined ? question.additionalInfo : "",
        selectionAnswers:
          question.type === "selection" ? question.selectionAnswers : null
      };
    });
  };

  seperateSelectionAnswersWithCommans = question => {
    let answer = "";
    question.selectionAnswers.forEach((word, key) =>
      ++key === question.selectionAnswers.length
        ? (answer += word)
        : (answer += word + ", ")
    );
    return answer;
  };

  completedQuestionsForDocument = completedQuestions => {
    const parsedCompletedQuestions = completedQuestions.map(question => {
      switch (question.type) {
        case "selection":
          const answer = this.seperateSelectionAnswersWithCommans(question);
          return {
            answer,
            questionId: question.questionId,
            question: question.questionText,
            additionalInfo:
              question.additionalInfo !== undefined
                ? question.additionalInfo
                : ""
          };
        case "scale":
          return {
            question: question.questionText,
            questionId: question.questionId,
            answer: question.scaleAnswer.toString(),
            additionalInfo:
              question.additionalInfo !== undefined
                ? question.additionalInfo
                : ""
          };
        case "yesno":
          return {
            answer: question.yesNoAnswer,
            question: question.questionText,
            questionId: question.questionId,
            additionalInfo:
              question.additionalInfo !== undefined
                ? question.additionalInfo
                : ""
          };
        case "text":
          return {
            answer: question.textAnswer,
            questionId: question.questionId,
            question: question.questionText,
            additionalInfo:
              question.additionalInfo !== undefined
                ? question.additionalInfo
                : ""
          };
        case "dropdown":
          return {
            question: question.questionText,
            answer: question.dropdownAnswer,
            questionId: question.questionId,
            additionalInfo:
              question.additionalInfo !== undefined
                ? question.additionalInfo
                : ""
          };
        default:
          break;
      }
      return null;
    });

    return _.orderBy(parsedCompletedQuestions, ["questionId"]);
  };

  getCase = async caseId => {
    const response = await api.getCase(caseId);
    if (response !== undefined) {
      this.props.updateMi3dCase(response.data);
    } else this.props.showErrorModal();
  };

  addDocumentToMi3DCase = async (
    name,
    type,
    documentPath,
    completedDate = ""
  ) => {
    const response = await api.addDocumentToCase(
      this.surveyDocumentForMi3DCase(name, type, documentPath, completedDate)
    );

    if (response !== undefined) this.getCase(this.props.mi3dCase.caseId);
    else this.props.showErrorModal();

    const document = {
      path: documentPath,
      filename: name,
      bluedogCaseRef: this.props.bluedogCase.bluedogCaseRef
    };
    this.addDocumentToBluedogCase(document);
  };

  surveyDocumentForMi3DCase = (name, type, path, completedDate) => {
    let parsedDate = moment(completedDate).format("DD/MM/YYYY");
    return {
      path,
      name,
      type,
      completedDate: parsedDate,
      actionedBy: this.props.username,
      caseId: this.props.mi3dCase.caseId
    };
  };

  addDocumentToBluedogCase = async document => {
    await api.addDocumentToBluedogCase(document);
  };

  getCorrectAnswerForQuestionType = question => {
    switch (question.type) {
      case "yesno":
        return question.yesNoAnswer;
      case "selection":
        return question.selectionAnswers;
      case "scale":
        return question.scaleAnswer;
      case "text":
        return question.textAnswer;
      case "dropdown":
        return question.dropdownAnswer;
      default:
        return question.answer;
    }
  };

  goBackToCase = () => {
    this.props.history.push(
      `/cms/rehab/case/${this.props.mi3dCase.bluedogCaseRef}`
    );
  };

  goBackToCaseList = () => {
    this.props.history.push("/cms/rehab/cases");
  };

  openStopCaseModal = () => {
    this.setState({
      stopCaseModalOpen: true,
      modalButtonText: "Stop Case",
      modalTitle: "Reason for stopping the case",
      modalReasonText: "Reason for putting the case on hold:"
    });
  };

  render() {
    return (
      <Container fluid id="surveys">
        <PageTopBar
          title={this.state.surveyName}
          openHoldModal={this.openStopCaseModal}
          openDpaModal={() => this.setState({ dpaModalOpen: true })}
          caseClosed={this.props.mi3dCase.caseClosed}
        />

        {this.renderSurvey()}

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
          statement={""}
          id="stopCaseModal"
          history={this.props.history}
          title={this.state.modalTitle}
          username={this.props.username}
          bluedogCase={this.props.bluedogCase}
          reasonText={this.state.modalReasonText}
          isModalOpen={this.state.stopCaseModalOpen}
          buttonContent={this.state.modalButtonText}
          closeModal={() => this.setState({ stopCaseModalOpen: false })}
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
  updateMi3dCase: selectedCase => dispatch(updateMi3dCase(selectedCase)),
  selectSecondaryItem: menuItem => dispatch(selectSecondaryItem(menuItem)),
  updateBluedogCase: selectedCase => dispatch(updateBluedogCase(selectedCase))
});

const mapStateToProps = state => ({
  mi3dCase: state.case.mi3dCase,
  username: state.auth.user.name,
  bluedogCase: state.case.selectedCase,
  completedInitialSurvey: state.case.mi3dCase.completedInitialSurvey,
  completedClinicianSurvey: state.case.mi3dCase.completedClinicianSurvey
});

export default withErrorHandling(
  withCaseLocking(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Survey)
  )
);
