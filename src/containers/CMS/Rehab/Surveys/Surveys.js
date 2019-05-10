import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col, PageHeader, PageAction } from "components/Common";
import InjuredPartyDetails from "components/CMS/Rehab/Case/InjuredPartyDetails/InjuredPartyDetails";
import InitialSurvey from "components/CMS/Rehab/Surveys/InitialSurvey/InitialSurvey";
import DPAScript from "components/CMS/Rehab/Surveys/DPAScript/DPAScript";
import CaseModal from "components/CMS/Rehab/Case/CaseModal/CaseModal";
import CaseDetails from "components/CMS/Rehab/Case/CaseDetails/CaseDetails";
import SurveyBuilder from "components/CMS/Rehab/Surveys/SurveyBuilder/SurveyBuilder";

import "./Surveys.scss";

class Survey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyName: "",
      caseModalOpen: false,
      caseModalButtonContent: "",
      caseModalTitle: "",
      caseModalReasonText: "",
      completedQuestions: [],
      completedInitialSurvey: null
    };
  }

  renderSurvey = () => {
    const survey = this.props.history.location.pathname;
    if (survey.includes("initial")) {
      return (
        <InitialSurvey
          history={this.props.history}
          returnQuestions={this.returnQuestions}
        />
      );
    }
  };

  renderName = () => {
    const survey = this.props.history.location.pathname;
    if (survey.includes("initial"))
      this.setState({ surveyName: "Initial Survey" });
  };

  renderAnswer = question => {
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

  componentDidMount() {
    this.renderName();
  }

  openHoldModal = () => {
    this.setState({
      caseModalOpen: true,
      caseModalButtonContent: "Hold Case",
      caseModalTitle: "Put the case on hold",
      caseModalReasonText: "Reason for putting the case on hold:"
    });
  };

  openCloseModal = () => {
    this.setState({
      caseModalOpen: true,
      caseModalButtonContent: "Close Case",
      caseModalTitle: "Close the case",
      caseModalReasonText: "Reason for closing the case:"
    });
  };

  returnQuestions = completedQuestions => {
    this.setState({ completedQuestions });
  };

  render() {
    return (
      <Container fluid>
        <PageHeader
          title={`${this.state.surveyName} - Case Ref: ${
            this.props.mi3dCase.bluedogCaseRef
          }`}
        >
          <PageAction
            actionName="Hold Case"
            triggerAction={this.openHoldModal}
          />
          <PageAction
            actionName="Close Case"
            triggerAction={this.openCloseModal}
          />
        </PageHeader>
        <Row>
          {/* LEFT SIDE  */}
          <Col lg={6} sm={12}>
            <Row>
              <Col sm={12}>
                <DPAScript />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>{this.renderSurvey()}</Col>
            </Row>
          </Col>
          {/* END OF LEFT SIDE  */}

          {/* RIGHT SIDE */}
          <Col lg={6} sm={12}>
            {/* <Row>
              <Col sm={12}>
                <CaseDetails
                  mi3dCase={this.props.mi3dCase}
                  case={this.props.case}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <InjuredPartyDetails />
              </Col>
            </Row> */}
            <Row>
              <Col sm={12}>
                <SurveyBuilder
                  completedQuestions={this.state.completedQuestions}
                  mi3dCase={this.props.mi3dCase}
                  bdCase={this.props.case}
                  username={this.props.username}
                />
              </Col>
            </Row>
          </Col>
          {/* END OF RIGHT SIDE */}
        </Row>
        <CaseModal
          isModalOpen={this.state.caseModalOpen}
          buttonContent={this.state.caseModalButtonContent}
          title={this.state.caseModalTitle}
          closeModal={() => this.setState({ caseModalOpen: false })}
          reasonText={this.state.caseModalReasonText}
          bluedogCase={this.props.case}
          username={this.props.username}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  case: state.case.selectedCase,
  mi3dCase: state.case.mi3dCase,
  username: state.auth.user.name
});

export default connect(mapStateToProps)(Survey);
