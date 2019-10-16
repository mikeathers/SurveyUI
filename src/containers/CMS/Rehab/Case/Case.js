import React, { Component } from "react";
import * as api from "api";
import moment from "moment";
import { connect } from "react-redux";
import { updateMi3dCase, updateBluedogCase } from "actions";
import { withErrorHandling, withCaseLocking } from "HOCs";

import Chases from "components/CMS/Rehab/Case/Chases/Chases";
import DPAModal from "components/CMS/Rehab/DPAModal/DPAModal";
import PageTopBar from "components/CMS/Rehab/PageTopBar/PageTopBar";
import CaseNotes from "components/CMS/Rehab/Case/CaseNotes/CaseNotes";
import CallBacks from "components/CMS/Rehab/Case/CallBacks/CallBacks";
import CaseDetails from "components/CMS/Rehab/Case/CaseDetails/CaseDetails";
import StopCaseModal from "components/CMS/Rehab/StopCaseModal/StopCaseModal";
import CaseDocuments from "components/CMS/Rehab/Case/CaseDocuments/CaseDocuments";
import CaseActivities from "components/CMS/Rehab/Case/CaseActivities/CaseActivities";
import Correspondence from "components/CMS/Rehab/Case/Correspondence/Correspondence";
import CaseLockedModal from "components/CMS/Rehab/Case/CaseLockedModal/CaseLockedModal";
import SystemActivities from "components/CMS/Rehab/Case/SystemActivities/SystemActivities";
import AvailableSurveys from "components/CMS/Rehab/Case/AvailableSurveys/AvailableSurveys";
import InjuredPartyDetails from "components/CMS/Rehab/Case/InjuredPartyDetails/InjuredPartyDetails";
import CompleteChaseModal from "components/CMS/Rehab/Case/Chases/CompleteChaseModal/CompleteChaseModal";
import UpdateCaseDetailsModal from "components/CMS/Rehab/UpdateCaseDetailsModal/UpdateCaseDetailsModal";
import InjuredPartyContactDetails from "components/CMS/Rehab/Case/InjuredPartyContactDetails/InjuredPartyContactDetails";
import { Container, Row, Col } from "components/Common";

class Case extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalTitle: "",
      modalStatement: "",
      modalButtonText: "",
      chaseDueToday: null,
      dpaModalOpen: false,
      stopCaseModalOpen: false,
      caseLockedModalOpen: false,
      showCompleteChaseModal: false,
      showUpdateCaseDetailsModal: false,
      mi3dCase: props.mi3dCase !== undefined ? props.mi3dCase : {}
    };
  }

  componentWillReceiveProps({ mi3dCase }) {
    this.setState({ mi3dCase });
  }

  async componentDidMount() {
    const { mi3dCase } = this.props;
    if (!mi3dCase.dpaAccepted) this.setState({ dpaModalOpen: true });
    if (mi3dCase.chases !== undefined) this.checkIfChaseIsDue();
  }

  checkIfChaseIsDue = () => {
    const chases = this.props.mi3dCase.chases;
    const chaseDueToday = chases.find(chase => {
      const todaysDate = moment().format("DD/MM/YYYY");
      const chaseDateFormatted = moment(chase.chaseDate).format("DD/MM/YYYY");
      if (chaseDateFormatted === todaysDate && chase.complete === false)
        return chase;
      return null;
    });
    if (chaseDueToday !== undefined) this.openChaseModal(chaseDueToday);
  };

  selectSurvey = path => {
    this.props.history.push(path);
  };

  openChaseModal = chaseDueToday => {
    this.setState({ chaseDueToday, showCompleteChaseModal: true });
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

  resumeCase = async () => {
    const resumeCaseInfo = {
      caseId: this.props.mi3dCase.caseId
    };

    const response = await api.takeCaseOffHold(resumeCaseInfo);

    if (response !== undefined) {
      if ((response.status = 200)) this.props.updateMi3dCase(response.data);
      else this.props.showErrorModal();
    } else this.props.showErrorModal();
  };

  render() {
    return this.props.mi3dCase.bluedogCaseRef !== undefined ? (
      <Container fluid id="casesContainer">
        <PageTopBar
          title={`Case Ref - ${this.props.bluedogCase.bluedogCaseRef}`}
          openHoldModal={this.openStopCaseModal}
          openDpaModal={() => this.setState({ dpaModalOpen: true })}
          caseClosed={this.props.mi3dCase.caseClosed}
        />
        <Row />
        <Row>
          <Col lg={6} md={12} sm={12}>
            <Row>
              <Col sm={12}>
                <InjuredPartyDetails />
              </Col>
            </Row>

            <Row>
              <Col sm={12}>
                <AvailableSurveys
                  mi3dCase={this.state.mi3dCase}
                  selectSurvey={this.selectSurvey}
                  bluedogCaseRef={this.props.bluedogCase.bluedogCaseRef}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <CaseDocuments documents={this.props.mi3dCase.caseDocuments} />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Correspondence emails={this.props.mi3dCase.emails} />
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
            <Row>
              <Col sm={12}>
                <CaseActivities mi3dCase={this.props.mi3dCase} />
              </Col>
            </Row>
          </Col>

          {/* RIGHT SIDE  */}
          <Col lg={6} md={12} sm={12}>
            <Row>
              <Col sm={12}>
                <CaseDetails
                  resumeCase={this.resumeCase}
                  mi3dCase={this.props.mi3dCase}
                  username={this.props.username}
                  bluedogCase={this.props.bluedogCase}
                  updateMi3dCase={this.props.updateMi3dCase}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <SystemActivities
                  activities={this.props.mi3dCase.systemActivities}
                  bluedogCase={this.props.bluedogCase}
                  mi3dCase={this.props.mi3dCase}
                  username={this.props.username}
                  updateMi3dCase={this.props.updateMi3dCase}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
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
              <Col sm={12}>
                <CallBacks
                  mi3dCase={this.props.mi3dCase}
                  username={this.props.username}
                  bluedogCase={this.props.bluedogCase}
                  updateMi3dCase={this.props.updateMi3dCase}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Chases
                  history={this.props.history}
                  mi3dCase={this.props.mi3dCase}
                  username={this.props.username}
                  bluedogCase={this.props.bluedogCase}
                  updateMi3dCase={this.props.updateMi3dCase}
                  updateBluedogCase={this.props.updateBluedogCase}
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
          statement={""}
          id="stopCaseModal"
          history={this.props.history}
          defaultStopCaseReasons={true}
          title={this.state.modalTitle}
          username={this.props.username}
          bluedogCase={this.props.bluedogCase}
          reasonText={this.state.modalReasonText}
          isModalOpen={this.state.stopCaseModalOpen}
          buttonContent={this.state.modalButtonText}
          closeModal={() => this.setState({ stopCaseModalOpen: false })}
        />
        <CompleteChaseModal
          username={this.props.username}
          chase={this.state.chaseDueToday}
          isModalOpen={this.state.showCompleteChaseModal}
          closeModal={() => this.setState({ showCompleteChaseModal: false })}
        />
        <UpdateCaseDetailsModal
          id="updateCaseDetailsModal"
          mi3dCase={this.props.mi3dCase}
          username={this.props.username}
          salasoId={this.props.mi3dCase.salasoId}
          updateMi3dCase={this.props.updateMi3dCase}
          isModalOpen={this.state.showUpdateCaseDetailsModal}
          courseDuration={this.props.mi3dCase.courseDurationInWeeks}
          numberOfPrescribedExercises={
            this.props.mi3dCase.numberOfPrescribedExercises
          }
          closeModal={() =>
            this.setState({ showUpdateCaseDetailsModal: false })
          }
        />
        <CaseLockedModal
          id="caseLockedModal"
          lockedBy={this.props.mi3dCase.lockedBy}
          goBackToCaseList={this.goBackToCaseList}
          isModalOpen={this.state.caseLockedModalOpen}
          closeModal={() => this.setState({ caseLockedModalOpen: false })}
        />
      </Container>
    ) : (
      <div>
        <p>Case Not Found</p>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  mi3dCase: state.case.mi3dCase,
  username: state.auth.user.name,
  bluedogCase: state.case.selectedCase
});

const mapDispatchToProps = dispatch => ({
  updateMi3dCase: updatedCase => dispatch(updateMi3dCase(updatedCase)),
  updateBluedogCase: updatedCase => dispatch(updateBluedogCase(updatedCase))
});

export default withErrorHandling(
  withCaseLocking(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Case)
  )
);
