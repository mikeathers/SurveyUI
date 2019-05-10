import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { updateMi3dCase, selectSecondaryItem } from "actions";
import * as api from "api";
import { Card, ButtonContainer, Button } from "components/Common";
import QuestionGroup from "components/CMS/Rehab/Surveys/QuestionGroup/QuestionGroup";
import questions from "questions/initialSurveyQuestions";
import KnockoutModal from "../KnockoutModal/KnockoutModal";
import { injuredPartyDetailsForDocument } from "helpers/util";

import { initialKnockoutGiven } from "emailTemplates";

import "./InitialSurvey.scss";

class InitialSurvey extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      completedQuestions: [],
      survey: {},
      parsedQuestions: null,
      knockouts: [],
      knockoutModalOpen: false,
      update: false,
      documentId: "",
      documentPath: ""
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const survey = this.props.mi3dCase.completedSurveys.find(
      m => m.type === "Initial"
    );

    if (survey !== undefined) {
      const completedSurveyId = survey.completedSurveyId;

      const documentId = this.props.mi3dCase.caseDocuments.find(
        m => m.name === "Initial Survey"
      ).caseDocumentId;

      this.setState({ documentId });

      const completedSurveyRequest = {
        completedSurveyId,
        actionedBy: this.props.user.name
      };

      api.getCompletedSurvey(completedSurveyRequest).then(res => {
        if (this._isMounted) {
          this.setState({ survey: res.result, update: true }, () => {
            this.setState({
              completedQuestions: this.parsedCompletedQuestions()
            });
          });
        }
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  completedQuestions = () => {
    return this.state.completedQuestions.map(question => {
      return {
        yesNoAnswer: question.question.type === "yesno" ? question.answer : "",
        scaleAnswer: question.question.type === "scale" ? question.answer : 0,
        selectionAnswers:
          question.question.type === "selection" ? question.answer : null,
        questionText: question.question.text,
        type: question.question.type,
        questionId: question.question.questionId
      };
    });
  };

  completedSurvey = type => {
    const { completedSurveys } = this.props.mi3dCase;
    const existingSurvey = completedSurveys.find(m => m.type === type);
    return {
      type,
      caseId: this.props.mi3dCase.caseId,
      completedQuestions: this.completedQuestions(),
      completedSurveyId:
        existingSurvey !== undefined ? existingSurvey.completedSurveyId : 0,
      actionedBy: this.props.user.name,
      completedBy: this.props.user.name
    };
  };

  completedQuestionsForDocument = () => {
    const completedQuestions = this.state.completedQuestions.map(question => {
      switch (question.question.type) {
        case "selection":
          let answer = "";
          question.answer.forEach((word, key) =>
            ++key === question.answer.length
              ? (answer += word)
              : (answer += word + ", ")
          );
          return {
            question: question.question.text,
            answer,
            questionId: question.question.questionId
          };
        case "scale":
          return {
            question: question.question.text,
            answer: question.answer.toString(),
            questionId: question.question.questionId
          };
        default:
          break;
      }
      return {
        question: question.question.text,
        answer: question.answer,
        questionId: question.question.questionId
      };
    });

    return _.orderBy(completedQuestions, ["questionId"]);
  };

  surveyForDocumentBuilder = () => {
    const injuredPartyDetails = injuredPartyDetailsForDocument(
      this.props.bluedogCase
    );
    return {
      surveyType: "Initial",
      completedQuestions: this.completedQuestionsForDocument(),
      ...injuredPartyDetails
    };
  };

  surveyDocumentForCase = (path, caseDocumentId) => {
    return {
      path,
      name: "Initial Survey",
      type: "Survey",
      actionedBy: this.props.user.name,
      caseId: this.props.mi3dCase.caseId,
      caseDocumentId
    };
  };

  createSurveyDocument = () => {
    return api
      .createSurveyDocument(this.surveyForDocumentBuilder())
      .then(res => {
        if (!res.data.hasErrors) {
          if (!this.state.update) {
            const documentPath = res.data.result;
            api
              .addDocumentToCase(this.surveyDocumentForCase(documentPath))
              .then(res => {
                this.props.updateMi3dCase(res.data.result);
              });
            return documentPath;
          } else {
            const documentPath = res.data.result;
            api
              .updateDocumentOnCase(
                this.surveyDocumentForCase(documentPath, this.state.documentId)
              )
              .then(res => {
                this.props.updateMi3dCase(res.data.result);
              });
            const document = {
              path: documentPath,
              filename: "Initial Survey",
              bluedogCaseRef: this.props.bluedogCase.bluedogCaseRef
            };
            api.addDocumentToBluedogCase(document).then(res => {});
            return documentPath;
          }
        } else {
          console.log(res);
          const errors = {
            errorMessages: res.data.errors.map(m => m.errorMessage),
            serviceName: "DocumentBuilder",
            functionName: "CreateSurveyDocument",
            actionedBy: this.props.username
          };
          api.logErrors(errors);
        }
      });
  };

  emailToSend = documentPath => {
    return {
      attachments: [documentPath],
      to: "michael.atherton@premex.com",
      from: "michael.atherton@premex.com",
      subject: "Mi3D Inital Survey",
      body: initialKnockoutGiven(this.props.bluedogCase)
    };
  };

  submitSurvey = () => {
    if (this.state.knockouts.length > 0) {
      this.setState({ knockoutModalOpen: true });
      const completedSurvey = this.completedSurvey("Initial");
      api.saveCompletedSurvey(completedSurvey);
      this.createSurveyDocument().then(documentPath => {
        api
          .sendEmail(this.emailToSend(documentPath))
          .then(res => console.log(res));
      });
    } else {
      const completedSurvey = this.completedSurvey("Initial");
      api.saveCompletedSurvey(completedSurvey).then(res => {
        this.props.updateMi3dCase(res.result);
        this.props.selectSecondaryItem("Cases");
        this.props.history.push(`/cms/rehab/case/${res.result.bluedogCaseRef}`);
      });
      this.createSurveyDocument();
    }
  };

  returnQuestions = completedQuestions => {
    this.setState({ completedQuestions });
    this.props.returnQuestions(completedQuestions);
  };

  returnAnswer = question => {
    switch (question.type) {
      case "yesno":
        return question.yesNoAnswer;
      case "selection":
        return question.selectionAnswers;
      case "scale":
        return question.scaleAnswer;
      default:
        return null;
    }
  };

  parsedCompletedQuestions = () => {
    if (this.state.survey.completedQuestions !== undefined) {
      const parsedQuestions = this.state.survey.completedQuestions.map(
        question => {
          return {
            question: {
              questionId: question.questionId,
              type: question.type,
              text: question.questionText
            },
            answer: this.returnAnswer(question),
            id: question.questionId
          };
        }
      );
      return parsedQuestions;
    }
  };

  returnKnockout = result => {
    const updatedKnockouts = this.state.knockouts
      .filter(m => m.id !== result.id)
      .concat(result);
    const orderedKnockouts = _.orderBy(updatedKnockouts, ["id"]);
    this.setState({ knockouts: orderedKnockouts });
  };

  removeKnockoutFromList = result => {
    const updatedKnockouts = this.state.knockouts.filter(
      m => m.question.questionId !== result.question.questionId
    );
    this.setState({ knockouts: updatedKnockouts });
  };

  holdCase = () => {};

  render() {
    return (
      <Card
        title="General Questions"
        collapse={true}
        isOpenByDefault={true}
        disabled={!this.props.mi3dCase.dpaAccepted}
      >
        <QuestionGroup
          questions={questions}
          returnQuestions={this.returnQuestions}
          completedQuestions={this.parsedCompletedQuestions()}
          returnKnockout={this.returnKnockout}
          removeKnockoutFromList={this.removeKnockoutFromList}
        />
        <ButtonContainer
          marginTop="25"
          marginBottom="5"
          justifyContent="flex-end"
        >
          <Button content="Submit Survey" primary onClick={this.submitSurvey} />
        </ButtonContainer>
        <KnockoutModal
          isModalOpen={this.state.knockoutModalOpen}
          closeModal={() => this.setState({ knockoutModalOpen: false })}
          knockouts={this.state.knockouts}
        />
      </Card>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  selectSecondaryItem: menuItem => dispatch(selectSecondaryItem(menuItem)),
  updateMi3dCase: selectedCase => dispatch(updateMi3dCase(selectedCase))
});

const mapStateToProps = state => ({
  mi3dCase: state.case.mi3dCase,
  user: state.auth.user,
  bluedogCase: state.case.selectedCase
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InitialSurvey);
