import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "components/Common";
import InitialSurvey from "components/CMS/Rehab/Surveys/InitialSurvey/InitialSurvey";
import ClinicianSurvey from "components/CMS/Rehab/Surveys/ClinicianSurvey/ClinicianSurvey";
import DisclosureModal from "components/CMS/Rehab/DisclosureModal/DisclosureModal";
import CaseModal from "components/CMS/Rehab/Case/CaseModal/CaseModal";
import SurveyBuilder from "components/CMS/Rehab/Surveys/SurveyBuilder/SurveyBuilder";
import PageTopBar from "components/CMS/Rehab/PageTopBar/PageTopBar";
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
  componentDidMount() {
    this.renderName();
  }

  renderSurvey = () => {
    const survey = this.props.history.location.pathname;

    if (survey.includes("initial")) {
      return (
        <InitialSurvey
          history={this.props.history}
          returnQuestions={this.returnQuestions}
          completedQuestions={this.state.completedQuestions}
          username={this.props.username}
        />
      );
    }

    if (survey.includes("clinician")) {
      return <ClinicianSurvey />;
    }
  };

  renderName = () => {
    const survey = this.props.history.location.pathname;
    console.log(survey);
    if (survey.includes("initial"))
      this.setState({ surveyName: "Initial Survey" });
    if (survey.includes("clinician"))
      this.setState({ surveyName: "Clinician Survey" });
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
        <PageTopBar
          title={this.state.surveyName}
          openCloseModal={this.openCloseModal}
          openHoldModal={this.openHoldModal}
          openDisclosureModal={() =>
            this.setState({ disclosureModalOpen: true })
          }
        />
        {this.renderSurvey()}

        <CaseModal
          isModalOpen={this.state.caseModalOpen}
          buttonContent={this.state.caseModalButtonContent}
          title={this.state.caseModalTitle}
          closeModal={() => this.setState({ caseModalOpen: false })}
          reasonText={this.state.caseModalReasonText}
          bluedogCase={this.props.case}
          username={this.props.username}
        />
        <DisclosureModal
          isModalOpen={this.state.disclosureModalOpen}
          closeModal={() => this.setState({ disclosureModalOpen: false })}
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
